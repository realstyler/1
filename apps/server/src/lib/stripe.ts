import Stripe from "stripe";
import { environment } from "../config/environment.js";

export const stripe = new Stripe(environment.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});
