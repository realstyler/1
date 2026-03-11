import type z from "zod";
import type { CreateProjectSchema } from "./projects.schema.js";
import { 
  StylePreset, 
  Lighting, 
  Creativity, 
  Aesthetic 
} from "@prisma/client";

export type ProjectDTO = {
  id: string;
  shareId: string | null;
  userId: string;
  name: string;
  address: string | null;
  stylePreset: StylePreset | null;
  createdAt: Date;
  updatedAt: Date;
  originalImages: {
    id: string;
    projectId: string;
    originalPath: string;
    orderIndex: number;
    width?: number | null;
    height?: number | null;
    createdAt: Date;
    originalUrl?: string | null; 
    originalHighResUrl?: string | null;
    styledImages: {
      id: string;
      originalImageId: string;
      restyledPath: string;
      lighting: Lighting | null;
      creativity: Creativity | null;
      aesthetic: Aesthetic | null;
      width?: number | null;
      height?: number | null;
      createdAt: Date;
      restyledUrl?: string | null;
      restyledHighResUrl?: string | null;
    }[];
  }[];
};

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;