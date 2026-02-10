import type z from "zod";
import type { CreateCustomerSchema } from "./billing.schemas.js";

export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;
