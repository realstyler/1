import z from "zod";
import { MODELS, StylePresetEnum } from "../constants/index.js";

export const RestyleSchema = z.object({
  model: z.enum(MODELS, `Invalid selected model. Expected ${MODELS}`),
  style: z.enum(
    Object.values(StylePresetEnum),
    `Invalid selected style preset. Expected ${Object.values(StylePresetEnum)}`,
  ),
  paths: z.array(z.string({ message: "Invalid path" }), {
    message: "paths array is required",
  }),
});

export type RestyleInput = z.infer<typeof RestyleSchema>;
