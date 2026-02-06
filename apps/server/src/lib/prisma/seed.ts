import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter: pool });

(async () => {
  console.log("Seed started");

  const hash = await bcrypt.hash("qqqqqq", 10);
  const email = "user@gmail.com";

  await prisma.user.upsert({
    where: {
      email,
    },
    create: {
      name: "user",
      email,
      passwordHash: hash,
    },
    update: {},
  });

  await prisma.$disconnect();
})();
