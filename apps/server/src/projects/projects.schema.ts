import { z } from "zod";
import { StylePreset } from "../lib/prisma/generated/client/index.js";

export const CreateProjectSchema = z.object({
  name: z.string({ message: "Project name is required" }),
  stylePreset: z.enum(
    Object.values(StylePreset),
    `Invalid selected style preset. Expected ${Object.values(StylePreset)}`,
  ),
});
