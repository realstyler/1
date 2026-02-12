import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/index.js";
import "dotenv/config";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: pool });

const main = `
  Interior redesign of the same room shown in the reference image.
  Keep the exact room geometry, layout, walls, ceiling height, windows, doors, perspective and camera angle unchanged.
  Do not alter the structure of the room.

  Replace all furniture, decor and interior elements with a new interior design.
  Rearrange all furniture and interior objects completely within the room while maintaining the original geometry.
  The new design must look realistic, coherent and professionally designed.

  High-quality interior design render, photorealistic lighting, natural shadows, realistic materials, interior architecture photography.
  No distortion, no changes to room proportions, no added or removed walls.
`;

(async () => {
  console.log("Seed for prompts started");

  await prisma.stylePrompt.createMany({
    data: [
      {
        preset: "SCANDINAVIAN",
        displayName: "Scandinavian",
        description:
          "Light, airy spaces with functional simplicity and natural materials",
        colorPalette: "White, soft grey, light wood, neutral tones",
        content:
          main +
          `
            Scandinavian interior design style.
            Bright, airy and functional space.
            White walls, blonde wood, minimal decor, natural materials.
            Cozy, simple, clean and practical design.
          `,
      },
      {
        preset: "MINIMAL_LUXE",
        displayName: "Minimal Luxe",
        description: "Refined elegance through restrained sophistication",
        colorPalette: "Neutral tones, beige, taupe, soft white, stone",
        content:
          main +
          `
            Minimal luxe interior design.
            Elegant, refined and minimal space.
            Neutral palette, high-end materials, clean lines.
            Subtle luxury, calm and sophisticated atmosphere.
          `,
      },
      {
        preset: "MODERN_COASTAL",
        displayName: "Modern Coastal",
        description: "Relaxed seaside living with contemporary polish",
        colorPalette: "Blue, white, sand, soft beige, ocean tones",
        content:
          main +
          `
            Modern coastal interior design.
            Relaxed seaside atmosphere with modern styling.
            Blues, whites, natural textures, ocean-inspired accents.
            Bright, fresh and airy environment.
          `,
      },
      {
        preset: "JAPANDI",
        displayName: "Japandi",
        description: "Japanese minimalism meets Scandinavian warmth",
        colorPalette: "Muted earth tones, warm wood, soft beige, grey",
        content:
          main +
          `
            Japandi interior design.
            Minimalist, calm and balanced space.
            Muted earth tones, organic shapes, natural materials.
            Zen simplicity with warm Scandinavian touch.
          `,
      },
      {
        preset: "BOLD_COLOUR",
        displayName: "Bold Colour",
        description: "Vibrant, expressive spaces that make a statement",
        colorPalette: "Saturated hues, contrast tones, vivid accents",
        content:
          main +
          `
            Bold colour interior design.
            Vibrant and expressive space.
            Strong saturated colours, colour blocking, artistic accents.
            Energetic, modern and statement-making atmosphere.
          `,
      },
      {
        preset: "URBAN_INDUSTRIAL",
        displayName: "Urban Industrial",
        description: "Raw urban aesthetic with exposed architectural elements",
        colorPalette: "Concrete grey, black, metal, dark brown",
        content:
          main +
          `
            Urban industrial interior design.
            Raw, urban and loft-style space.
            Exposed brick, metal, concrete, industrial lighting.
            Minimal decor, strong architectural character.
          `,
      },
      {
        preset: "HAMPTONS_CLASSIC",
        displayName: "Hamptons Classic",
        description: "Timeless coastal elegance inspired by East Coast estates",
        colorPalette: "Navy, white, soft grey, coastal neutrals",
        content:
          main +
          `
            Hamptons classic interior design.
            Timeless, elegant coastal style.
            Navy and white palette, classic furniture, light and airy space.
            Refined, calm and sophisticated atmosphere.
          `,
      },
      {
        preset: "MID_CENTURY_MODERN",
        displayName: "Mid-Century Modern",
        description: "Retro-futuristic design from the 1950s-60s golden era",
        colorPalette: "Warm wood, olive, mustard, teal, neutral tones",
        content:
          main +
          `
            Mid-century modern interior design.
            Retro yet timeless style.
            Organic curves, tapered legs, statement lighting.
            Warm wood tones and clean modern composition.
          `,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed for prompts finished");
  await prisma.$disconnect();
})();
