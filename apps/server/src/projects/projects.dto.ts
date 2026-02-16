import type z from "zod";
import type { CreateProjectSchema } from "./projects.schema.js";
import type { StylePreset } from "@prisma/client";

export type ProjectDTO = {
  images: {
    id: string;
    createdAt: Date;
    projectId: string;
    originalPath: string;
    restyledPath: string;
    orderIndex: number;
  }[];
} & {
  id: string;
  shareId: string | null;
  userId: string;
  name: string;
  stylePreset: StylePreset;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
