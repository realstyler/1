import { z } from "zod";
import { environment } from "../config/environment.js";
import { PlanTier } from "../lib/prisma/generated/client/index.js";

export const CreateCustomerSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  name: z.string({ message: "Name is required" }),
});

export const TIER_TO_PRICE_ID: Record<string, string> = {
  PRO: environment.STRIPE_PRICE_ID_PRO,
  PRO_PLUS: environment.STRIPE_PRICE_ID_PRO_PLUS,
};

export const PRICE_TO_TIER: Record<string, PlanTier> = {
  [environment.STRIPE_PRICE_ID_PRO]: PlanTier.PRO,
  [environment.STRIPE_PRICE_ID_PRO_PLUS]: PlanTier.PRO_PLUS,
};
