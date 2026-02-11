import { z } from "zod";
import { environment } from "../config/environment.js";
import {
  PlanTier,
  SubscriptionStatus,
} from "../lib/prisma/generated/client/index.js";
import type Stripe from "stripe";

export const CreateCustomerSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  name: z.string({ message: "Name is required" }),
});

export const MAP_STRIPE_STATUS: Record<
  Stripe.Subscription.Status,
  SubscriptionStatus
> = {
  active: "ACTIVE",
  canceled: "CANCELED",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE_EXPIRED",
  past_due: "PAST_DUE",
  paused: "PAUSED",
  trialing: "TRIALING",
  unpaid: "UNPAID",
};

export const TIER_TO_PRICE_ID: Record<string, string> = {
  PRO: environment.STRIPE_PRICE_ID_PRO,
  PRO_PLUS: environment.STRIPE_PRICE_ID_PRO_PLUS,
};

export const PRICE_TO_TIER: Record<string, PlanTier> = {
  [environment.STRIPE_PRICE_ID_PRO]: PlanTier.PRO,
  [environment.STRIPE_PRICE_ID_PRO_PLUS]: PlanTier.PRO_PLUS,
};
