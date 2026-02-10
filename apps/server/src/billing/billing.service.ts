import { environment } from "../config/environment.js";
import ApiError from "../errors/apiError.js";
import { PlanTier } from "../lib/prisma/generated/client/index.js";
import { prisma } from "../lib/prisma/index.js";
import { stripe } from "../lib/stripe.js";
import type { UserDTO } from "../user/user.dto.js";
import { zodParseOrThrow } from "../utils/zodParseOrThrow.util.js";
import type { CreateCustomerDTO } from "./billing.dto.js";
import { CreateCustomerSchema, TIER_TO_PRICE_ID } from "./billing.schemas.js";

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

    const activeList = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
      limit: 1,
    });
    const trialingList = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "trialing",
      limit: 1,
    });
    const pastDueList = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "past_due",
      limit: 1,
    });

    const active =
      activeList.data[0] ?? trialingList.data[0] ?? pastDueList.data[0];

    // ===== NO SUBSCRIPTION → CREATE =====
    if (!active) {
      const session = await stripe.checkout.sessions.create(
        {
          customer: user.stripeCustomerId,
          mode: "subscription",
          line_items: [{ price: priceId, quantity: 1 }],
          metadata: {
            userId: user.id,
            planTier: plan,
          },
          success_url: environment.CLIENT_URL,
          cancel_url: environment.CLIENT_URL,
        },
        {
          idempotencyKey: `checkout_${user.id}`,
        },
      );

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
}

export const billingService = new BillingService();
