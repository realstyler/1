import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/index.js";
import "dotenv/config";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: pool });

const minimalism = `
    Interior redesign of the same room shown in the reference image.
    Keep the exact room geometry, layout, walls, ceiling height, windows, doors, perspective and camera angle unchanged.
    Do not alter the structure of the room.

    Replace all furniture, decor and interior elements with a new interior design.
    Rearrange all furniture and interior objects completely within the room while maintaining the original geometry.
    The new design must look realistic, coherent and professionally designed.

    High-quality interior design render, photorealistic lighting, natural shadows, realistic materials, interior architecture photography.
    No distortion, no changes to room proportions, no added or removed walls.


    Minimalist interior design style.
    Clean and simple design, minimal number of elements and decor.
    Neutral color palette, soft tones, simple geometric shapes.
    Modern minimalist furniture with clean lines and smooth surfaces.
    Uncluttered space, calm atmosphere, functional design.
    No ornamentation, no excessive decoration, no complex patterns.
`;

(async () => {
  console.log("Seed for prompts started");

  await prisma.stylePrompt.create({
    data: {
      preset: "MINIMAL_LUXE",
      displayName: "Minimalism",
      description: "",
      content: minimalism,
    },
  });

  await prisma.$disconnect();
})();
