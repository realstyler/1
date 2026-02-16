/*
  Warnings:

  - Made the column `restyled_url` on table `project_images` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "project_images" ALTER COLUMN "restyled_url" SET NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "share_id" DROP NOT NULL;
