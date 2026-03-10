import z from "zod";

export const CollectionItemSchema = z.object({
  originalImageId: z.string().optional(),
  styledImageId: z.string().optional(),
  orderIndex: z.number().int().min(0),
}).refine((data) => data.originalImageId || data.styledImageId, {
  message: "Either originalImageId or styledImageId must be provided",
});

export const CreateCollectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  items: z.array(CollectionItemSchema).min(1, "At least one item is required"),
});

export type CreateCollectionDTO = z.infer<typeof CreateCollectionSchema>;