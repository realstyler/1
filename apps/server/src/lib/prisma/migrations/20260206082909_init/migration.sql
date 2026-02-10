-- CreateEnum
CREATE TYPE "StylePreset" AS ENUM ('SCANDINAVIAN', 'MINIMAL_LUXE', 'MODERN_COASTAL', 'JAPANDI', 'BOLD_COLOUR', 'URBAN_INDUSTRIAL', 'HAMPTONS_CLASSIC', 'MID_CENTURY_MODERN');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('PRO', 'PRO_PLUS');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELED', 'PAST_DUE', 'UNPAID', 'TRIALING', 'INCOMPLETE', 'INCOMPLETE_EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "style_preset" "StylePreset" NOT NULL,
    "share_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_images" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "restyled_url" TEXT,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "plan_tier" "PlanTier" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_tracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "images_used" INTEGER NOT NULL DEFAULT 0,
    "images_limit" INTEGER NOT NULL,

    CONSTRAINT "usage_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_share_id_key" ON "projects"("share_id");

-- CreateIndex
CREATE INDEX "projects_user_id_idx" ON "projects"("user_id");

-- CreateIndex
CREATE INDEX "project_images_project_id_idx" ON "project_images"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "usage_tracking_user_id_idx" ON "usage_tracking"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "usage_tracking_user_id_period_start_period_end_key" ON "usage_tracking"("user_id", "period_start", "period_end");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
