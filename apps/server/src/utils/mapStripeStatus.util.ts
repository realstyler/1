import Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";
import { MAP_STRIPE_STATUS } from "../billing/billing.schemas.js";

export function mapStripeStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  const res = MAP_STRIPE_STATUS[status];
  if (!res) throw new Error(`Unhandled Stripe status: ${status}`);
  return res;
}
