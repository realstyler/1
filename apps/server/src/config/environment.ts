import "dotenv/config";
import { z } from "zod";

/**
 * Runtime env validation.
 * App MUST crash on startup if config is invalid.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(4000),
  USE_MOCK_AI: z.coerce.boolean().default(false),
  SESSION_SECRET: z.string().default("secret_key"),
  DATABASE_URL: z.string(),
  CLIENT_URL: z.url(),

  GEMINI_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  SD_API_KEY: z.string(),

  GEMINI_MODEL: z.string(),

  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PRICE_ID_PRO: z.string(),
  STRIPE_PRICE_ID_PRO_PLUS: z.string(),

  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_BUCKET_NAME: z.string(),

  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
});

export const environment = envSchema.parse(process.env);
