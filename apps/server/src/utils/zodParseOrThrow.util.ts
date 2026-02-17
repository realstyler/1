import type { ZodType } from "zod";
import ApiError from "../errors/apiErrors.js";

export function zodParseOrThrow<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success)
    throw new ApiError(result.error.issues[0]?.message ?? "Bad Request", 400);
  return result.data;
}
