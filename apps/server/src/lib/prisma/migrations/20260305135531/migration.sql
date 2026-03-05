-- DropIndex
DROP INDEX "usage_tracking_user_id_period_start_period_end_key";

-- AlterTable
ALTER TABLE "usage_tracking" ADD COLUMN     "guest_id" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "usage_tracking_guest_id_idx" ON "usage_tracking"("guest_id");
