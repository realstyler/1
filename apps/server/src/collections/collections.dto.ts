import type z from "zod";
import type { CreateCollectionSchema } from "./collections.schema.js";
import { 
  Lighting, 
  Creativity, 
  Aesthetic 
} from "@prisma/client";

export type CreateCollectionDTO = z.infer<typeof CreateCollectionSchema>;

export type CollectionItemDTO = {
  id: string;
  orderIndex: number;
  type: "RESTYLED" | "ORIGINAL" | "UNKNOWN";
  imageUrl: string | null;
  originalImageId: string | null;
  styledImageId: string | null;
  metadata: {
    lighting: Lighting | null;
    creativity: Creativity | null;
    aesthetic: Aesthetic | null;
  } | null;
};

export type CollectionDTO = {
  id: string;
  projectId: string;
  name: string;
  shareId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CollectionDetailsDTO = {
  id: string;
  name: string;
  shareId: string | null;
  createdAt: Date;
  project: {
    id: string;
    name: string;
    address: string | null;
  } | null;
  agentProfile: {
    companyName: string | null;
    contactInfo: string | null;
    logoUrl: string | null;
  } | null;
  items: CollectionItemDTO[];
};