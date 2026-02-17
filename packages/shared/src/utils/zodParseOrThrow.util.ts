import type { ZodType } from "zod";
import { ApiError } from "./apiError.js";

export function zodParseOrThrow<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const issue = result.error.issues[0];
    throw new ApiError(
      issue?.message ?? "Validation error",
      400,
      issue?.path.join("."),
    );
  }

  return result.data;
}
