import type z from "zod";
import type { LoginSchema, RegisterSchema } from "./auth.schemas.js";

export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
