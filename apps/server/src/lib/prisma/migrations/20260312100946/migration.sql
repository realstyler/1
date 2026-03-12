/*
  Warnings:

  - You are about to drop the `style_prompt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "style_prompt";

-- CreateTable
CREATE TABLE "styles" (
    "preset" "StylePreset" NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "color_palette" TEXT,
    "image_url" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "styles_pkey" PRIMARY KEY ("preset")
);
