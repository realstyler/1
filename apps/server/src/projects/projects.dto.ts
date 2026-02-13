import type z from "zod";
import type { CreateProjectSchema } from "./projects.schema.js";

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
