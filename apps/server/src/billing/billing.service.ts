import Stripe from "stripe";
import { environment } from "../config/environment.js";
import ApiError from "../errors/apiError.js";
import { PlanTier } from "../lib/prisma/generated/client/index.js";
import { prisma } from "../lib/prisma/index.js";
import { stripe } from "../lib/stripe.js";
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

  async webhookHandler(payload: string, header: string | string[]) {
    const event = stripe.webhooks.constructEvent(
      payload,
      header,
      environment.STRIPE_WEBHOOK_SECRET,
    );

    console.log("EVENT", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCompleteSession(event);
        break;

      case "customer.subscription.updated":
        await this.handleSubscriptionUpdated(event);
        break;

      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(event);
        break;

      case "invoice.paid":
      case "invoice.payment_succeeded":
        await this.handleInvoicePaid(event);
        break;

      case "invoice.payment_failed":
        await this.handleInvoicePaymentFailed(event);
        break;
    }
  }

  private async handleCompleteSession(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;
    const stripeSubscriptionId = session.subscription as string;

    const subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId,
      { expand: ["items.data.price"] },
    );

    const item = subscription.items.data[0]!;

    const planTier = PRICE_TO_TIER[item.price.id];
    if (!planTier) {
      console.error("Unknown plan tier");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.metadata!.userId },
    });

    if (!user) {
      console.error("User not found");
      return;
    }

    const periodStart = item.current_period_start;
    const periodEnd = item.current_period_end;

    await prisma.subscription.upsert({
      where: { stripeSubscriptionId },
      create: {
        userId: user.id,
        stripeSubscriptionId,
        planTier,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
      },
      update: {
        planTier,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
      },
    });
  }

  private async handleSubscriptionUpdated(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;

    const item = subscription.items.data[0];
    if (!item) {
      console.error(`Item not found from subscription ${subscription.id}`);
      return;
    }

    const priceId = item.price.id;
    const planTier = PRICE_TO_TIER[priceId];
    if (!planTier) {
      console.error("Unknown plan tier");
      return;
    }

    const periodStart = item.current_period_start;
    const periodEnd = item.current_period_end;

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        planTier,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
      },
    });

    console.log("Subscription updated:", subscription.id, planTier);
  }

  private async handleSubscriptionDeleted(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: mapStripeStatus(subscription.status),
      },
    });

    console.log("Subscription canceled:", subscription.id);
  }

  private async handleInvoicePaid(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;

    // @ts-ignore
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) {
      console.log(`${event.type} without subscription`);
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price"],
    });

    const item = subscription.items.data[0];
    if (!item) {
      console.error(`Item not found from subscription ${subscription.id}`);
      return;
    }

    const planTier = PRICE_TO_TIER[item.price.id];
    if (!planTier) {
      console.error("Unknown plan tier");
      return;
    }

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(item.current_period_start * 1000),
        currentPeriodEnd: new Date(item.current_period_end * 1000),
        planTier,
      },
    });

    console.log("Payment success:", subscriptionId);
  }

  private async handleInvoicePaymentFailed(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;

    // @ts-ignore
    const subscriptionId = invoice.subscription as string | null;
    if (!subscriptionId) {
      console.log("invoice.payment_failed without subscription");
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price"],
    });

    const item = subscription.items.data[0];
    if (!item) {
      console.error(`Item not found from subscription ${subscription.id}`);
      return;
    }

    const planTier = PRICE_TO_TIER[item.price.id];

    const periodStart = item.current_period_start;
    const periodEnd = item.current_period_end;

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: "PAST_DUE",
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
        planTier,
      },
    });

    console.log("Payment FAILED:", {
      subscriptionId,
      customer: invoice.customer,
      attempt_count: invoice.attempt_count,
      next_payment_attempt: invoice.next_payment_attempt,
    });

    // TODO: restrict access | send email
  }
}

export const billingService = new BillingService();
