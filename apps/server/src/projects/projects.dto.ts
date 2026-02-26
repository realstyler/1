import type z from "zod";
import type { CreateProjectSchema } from "./projects.schema.js";
import { StylePreset } from "@prisma/client";

export type ProjectDTO = {
  id: string;
  shareId: string | null;
  userId: string;
  name: string;
  address: string | null;
  stylePreset: StylePreset | null;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    createdAt: Date;
    projectId: string;
    originalPath: string;
    restyledPath: string;
    orderIndex: number;
    originalUrl?: string;
    restyledUrl?: string;
  }[];
};

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
