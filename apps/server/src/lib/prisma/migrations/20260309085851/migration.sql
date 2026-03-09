/*
  Warnings:

  - You are about to drop the `project_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Lighting" AS ENUM ('NATURAL', 'WARM', 'AMBIENT');

-- CreateEnum
CREATE TYPE "Creativity" AS ENUM ('SUBTLE', 'BALANCED', 'BOLD');

-- CreateEnum
CREATE TYPE "Aesthetic" AS ENUM ('MODERN', 'COASTAL', 'MINIMAL', 'JAPANDI', 'INDUSTRIAL', 'CLASSIC', 'SCANDI', 'BOHO', 'RUSTIC');

-- DropForeignKey
ALTER TABLE "project_images" DROP CONSTRAINT "project_images_project_id_fkey";

-- DropTable
DROP TABLE "project_images";

-- CreateTable
CREATE TABLE "original_project_images" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "original_project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "styled_project_images" (
    "id" TEXT NOT NULL,
    "original_image_id" TEXT NOT NULL,
    "restyled_url" TEXT NOT NULL,
    "lighting" "Lighting",
    "creativity" "Creativity",
    "aesthetic" "Aesthetic",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "styled_project_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "original_project_images_project_id_idx" ON "original_project_images"("project_id");

-- CreateIndex
CREATE INDEX "styled_project_images_original_image_id_idx" ON "styled_project_images"("original_image_id");

-- AddForeignKey
ALTER TABLE "original_project_images" ADD CONSTRAINT "original_project_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "styled_project_images" ADD CONSTRAINT "styled_project_images_original_image_id_fkey" FOREIGN KEY ("original_image_id") REFERENCES "original_project_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
