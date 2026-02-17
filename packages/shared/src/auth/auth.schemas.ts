import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z
    .string({ message: "Password is required." })
    .min(6, { message: "The password must be longer than 6 characters." })
    .max(64, { message: "The password must be shorter than 64 characters." }),
});

export const RegisterSchema = z.object({
  name: z
    .string({ message: "Name is required." })
    .min(3, { message: "The name must be longer than 3 characters." })
    .max(24, { message: "The name must be shorter than 24 characters." }),
  ...LoginSchema.shape,
});
