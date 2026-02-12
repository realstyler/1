import { environment } from "../config/environment.js";
import ApiError from "../errors/apiError.js";
import { PlanTier } from "../lib/prisma/generated/client/index.js";
import { prisma } from "../lib/prisma/index.js";
import { stripe } from "../lib/stripe.js";
import { quotaService } from "../quota/quota.service.js";
import type { UserDTO } from "../user/user.dto.js";
import { mapStripeStatus } from "../utils/mapStripeStatus.util.js";
import { zodParseOrThrow } from "../utils/zodParseOrThrow.util.js";
import type { CreateCustomerDTO } from "./billing.dto.js";
import {
  CreateCustomerSchema,
  PRICE_TO_TIER,
  TIER_TO_PRICE_ID,
} from "./billing.schemas.js";

class BillingService {
  async createCustomer(input: CreateCustomerDTO) {
    const { name, email } = zodParseOrThrow(CreateCustomerSchema, input);
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new ApiError("User not found", 404);

    if (user.stripeCustomerId)
      throw new ApiError("User already have stripe customer", 400);

    const customer = await stripe.customers.create({
      email,
      name,
    });

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        stripeCustomerId: customer.id,
      },
    });

    return {
      customer,
      user: updatedUser,
    };
  }

  async createCheckoutSession(user: UserDTO, plan: PlanTier) {
    if (!user || !user.stripeCustomerId)
      throw new ApiError("Stripe customer id is required", 400);

    const priceId = TIER_TO_PRICE_ID[plan];
    if (!priceId) throw new ApiError(`Price not found by plan ${plan}`);

    const active = await this.getActiveSubscription(user.stripeCustomerId);

    // ===== NO SUBSCRIPTION → CREATE =====
    if (!active) {
      const session = await stripe.checkout.sessions.create({
        customer: user.stripeCustomerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          userId: user.id,
          planTier: plan,
        },
        success_url: environment.CLIENT_URL,
        cancel_url: environment.CLIENT_URL,
      });

      return { type: "checkout", url: session.url };
    }

    // ===== ALREADY SUBSCRIBED =====
    const currentPriceId = active.items.data[0]?.price.id;
    if (!currentPriceId) throw new Error("Price not found");

    if (currentPriceId === priceId)
      throw new ApiError("User already on this plan", 400);

    // ===== UPDATE SUBSCRIPTION (UPGRADE/DOWNGRADE) =====
    await stripe.subscriptions.update(active.id, {
      items: [
        {
          id: active.items.data[0]!.id,
          price: priceId,
        },
      ],
      proration_behavior: "create_prorations",
    });

    return { type: "updated" };
  }

  async getActiveSubscription(stripeCustomerId: string) {
    const list = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 10,
    });

    return (
      list.data.find((sub) =>
        ["active", "trialing", "past_due"].includes(sub.status),
      ) ?? null
    );
  }

  async repairQuotaFromStripe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.stripeCustomerId) return;

    const subscription = await this.getActiveSubscription(
      user.stripeCustomerId,
    );
    if (!subscription) throw new Error("Subscription not found");

    const item = subscription.items.data[0];
    if (!item) throw new Error("Subscription item not found");

    const planTier = PRICE_TO_TIER[item.price.id];
    if (!planTier) throw new Error("Unknown plan tier");

    const periodStart = new Date(item.current_period_start * 1000);
    const periodEnd = new Date(item.current_period_end * 1000);

    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      create: {
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        planTier,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      },
      update: {
        planTier,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      },
    });

    const imagesLimit = quotaService.getImagesLimitByPlan(planTier);

    await prisma.usageTracking.upsert({
      where: {
        userId_periodStart_periodEnd: {
          userId,
          periodStart,
          periodEnd,
        },
      },
      create: {
        userId,
        periodStart,
        periodEnd,
        imagesUsed: 0,
        imagesLimit,
      },
      update: {
        periodStart,
        periodEnd,
      },
    });

    console.log("Quota repaired from Stripe", {
      userId,
      periodStart,
      periodEnd,
    });
  }
}

export const billingService = new BillingService();
