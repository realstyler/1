import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, StylePreset } from "@prisma/client";
import "dotenv/config";
import { imageUploadService } from "../../upload/image-upload.service.js";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: pool });

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
  "https://images.unsplash.com/photo-1556912173-3bb406ef7e77",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f",
  "https://images.unsplash.com/photo-1497366216548-37526070297c",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
  "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45"
];

const PROJECT_NAMES = [
  "The Highland Loft", "Malibu Beach House", "Downtown Concrete",
  "Sunset Valley Remodel", "Cozy Cabin Retreat", "Modern Glass Villa",
  "Urban Studio", "Lakeside Mansion", "Minimalist Apartment",
  "Classic Victorian Update", "Desert Oasis", "Mountain View Lodge",
  "Riverfront Condo", "Historic Brownstone", "Eco-Friendly Home"
];

const ADDRESSES = [
  "1284 Highland Ave, Seattle, WA", "42 Ocean Drive, Malibu, CA",
  "99 Industrial Way, Brooklyn, NY", "Pending Location",
  "12 Bear Creek, Aspen, CO", "777 Glass Blvd, Austin, TX",
  "101 City Center, Chicago, IL", "88 Lake Rd, Tahoe, NV",
  "404 Blank St, Portland, OR", "1890 Old Town, Boston, MA"
];

const STYLES = Object.values(StylePreset);

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;
const getRandomElements = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

(async () => {
  console.log("🌱 Seed for projects started");

  const user = await prisma.user.findUnique({
    where: { email: "user@gmail.com" },
  });

  if (!user) {
    console.error("❌ User not found! Please run seed.ts first.");
    process.exit(1);
  }

  await prisma.project.deleteMany({
    where: { userId: user.id }
  });

  console.log("⬇️ Creating 15 mock projects (this may take a minute due to real image uploads to Supabase)...");

  for (let i = 0; i < 15; i++) {
    const hasImages = Math.random() > 0.2;
    const name = PROJECT_NAMES[i] || `Test Project ${i}`;
    const address = getRandomElement(ADDRESSES);
    const style = getRandomElement(STYLES);

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        address,
        stylePreset: style,
      }
    });

    if (hasImages) {
      const imagesCount = Math.floor(Math.random() * 3) + 1;
      const selectedImageUrls = getRandomElements(MOCK_IMAGES, imagesCount);

      const uploadedTmpImages = await imageUploadService.uploadImagesByUrls(selectedImageUrls);
      const projectImagesData = [];

      for (let j = 0; j < uploadedTmpImages.length; j++) {
        const tmpImage = uploadedTmpImages[j];
        
        if (tmpImage && tmpImage.path) {
          const origPath = await imageUploadService.moveImageToProject(tmpImage.path, project.id);
          projectImagesData.push({
            projectId: project.id,
            originalPath: origPath,
            restyledPath: null,
            orderIndex: j
          });
        }
      }

      if (projectImagesData.length > 0) {
        await prisma.projectImage.createMany({
          data: projectImagesData
        });
      }
    }

    console.log(`✅ Created project ${i + 1}/15: ${name} (${hasImages ? 'Completed' : 'Draft'})`);
  }

  console.log("✅ Seed for projects finished successfully!");
  await prisma.$disconnect();
})();