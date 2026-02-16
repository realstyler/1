import { PrismaClient } from "@prisma/client";
import { environment } from "../../config/environment.js";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new PrismaPg({ connectionString: environment.DATABASE_URL });
export const prisma = new PrismaClient({ adapter: pool });
