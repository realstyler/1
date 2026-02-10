import Stripe from "stripe";
import { SubscriptionStatus } from "../lib/prisma/generated/client/index.js";

export function mapStripeStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;

    case "trialing":
      return SubscriptionStatus.TRIALING;

    case "past_due":
      return SubscriptionStatus.PAST_DUE;

    case "canceled":
      return SubscriptionStatus.CANCELED;

    case "unpaid":
      return SubscriptionStatus.UNPAID;

    case "paused":
      return SubscriptionStatus.PAUSED;

    case "incomplete":
      return SubscriptionStatus.INCOMPLETE;

    case "incomplete_expired":
      return SubscriptionStatus.INCOMPLETE_EXPIRED;

    default:
      throw new Error(`Unhandled Stripe status: ${status}`);
  }
}
