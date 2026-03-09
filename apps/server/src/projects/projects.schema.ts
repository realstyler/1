import { z } from "zod";
import { StylePreset, Lighting, Creativity, Aesthetic } from "@prisma/client";

export const CreateProjectSchema = z.object({
  name: z.string({ message: "Project name is required" }),
  address: z.string().optional(),
  stylePreset: z.nativeEnum(StylePreset).optional(),
  images: z.optional(
    z.array(
      z.object({
        originalPath: z.string(),
        orderIndex: z.coerce.number(),
        styledImages: z.optional(
          z.array(
            z.object({
              restyledPath: z.string(),
              lighting: z.nativeEnum(Lighting).optional(),
              creativity: z.nativeEnum(Creativity).optional(),
              aesthetic: z.nativeEnum(Aesthetic).optional(),
            })
          )
        ),
      })
    )
  ),
});

export const ParamsGetAll = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().default(10),
});
