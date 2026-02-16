import { z } from "zod";
import { StylePreset } from "../lib/prisma/generated/client/index.js";

export const CreateProjectSchema = z.object({
  name: z.string({ message: "Project name is required" }),
  stylePreset: z.enum(
    Object.values(StylePreset),
    `Invalid selected style preset. Expected ${Object.values(StylePreset)}`,
  ),
  images: z.optional(
    z.array(
      z.object({
        originalPath: z.string(),
        restyledPath: z.string(),
        orderIndex: z.coerce.number(),
      }),
    ),
  ),
});

export const ParamsGetAll = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().default(10),
});
