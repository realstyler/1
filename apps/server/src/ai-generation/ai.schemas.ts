import { z } from "zod";
import { MODELS } from "../constants.js";
import { StylePreset } from "../lib/prisma/generated/client/index.js";

export const RestyleSchema = z.object({
  model: z.enum(MODELS, `Invalid selected model. Expected ${MODELS}`),
  style: z.enum(
    Object.values(StylePreset),
    `Invalid selected style preset. Expected ${Object.values(StylePreset)}`,
  ),
  images: z.array(
    z.object({
      path: z.string({ message: "Invalid path" }),
      mimeType: z.string({ message: "Invalid mimeType" }),
    }),
    {
      message: "paths array is required",
    },
  ),
});

export type RestyleInput = z.infer<typeof RestyleSchema>;
