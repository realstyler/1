import type Stripe from "stripe";
import { environment } from "../config/environment.js";
import { prisma } from "../lib/prisma/index.js";
import { stripe } from "../lib/stripe.js";
import { mapStripeStatus } from "../utils/mapStripeStatus.util.js";
import { PRICE_TO_TIER } from "./billing.schemas.js";
import { quotaService } from "../quota/quota.service.js";

class BillingWebhooks {
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

    const currentPeriodStart = new Date(item.current_period_start * 1000);
    const currentPeriodEnd = new Date(item.current_period_end * 1000);

    const sub = await prisma.subscription.upsert({
      where: { stripeSubscriptionId },
      create: {
        userId: user.id,
        stripeSubscriptionId,
        planTier,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart,
        currentPeriodEnd,
      },
      update: {
        planTier,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart,
        currentPeriodEnd,
      },
    });

    await quotaService.createPeriod({
      userId: sub.userId,
      periodStart: currentPeriodStart,
      periodEnd: currentPeriodEnd,
      imagesLimit: quotaService.getImagesLimitByPlan(sub.planTier),
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

    const currentPeriodStart = new Date(item.current_period_start * 1000);
    const currentPeriodEnd = new Date(item.current_period_end * 1000);

    const sub = await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        planTier,
        status: mapStripeStatus(subscription.status),
        currentPeriodStart,
        currentPeriodEnd,
      },
    });

    await quotaService.createPeriod({
      userId: sub.userId,
      periodStart: currentPeriodStart,
      periodEnd: currentPeriodEnd,
      imagesLimit: quotaService.getImagesLimitByPlan(sub.planTier),
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

    const currentPeriodStart = new Date(item.current_period_start * 1000);
    const currentPeriodEnd = new Date(item.current_period_end * 1000);

    const sub = await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: mapStripeStatus(subscription.status),
        currentPeriodStart,
        currentPeriodEnd,
        planTier,
      },
    });

    await quotaService.createPeriod({
      userId: sub.userId,
      periodStart: currentPeriodStart,
      periodEnd: currentPeriodEnd,
      imagesLimit: quotaService.getImagesLimitByPlan(sub.planTier),
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

export const billingWebhooks = new BillingWebhooks();
