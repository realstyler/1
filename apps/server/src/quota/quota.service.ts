import { billingService } from "../billing/billing.service.js";
import ApiError from "../errors/apiError.js";
import type { PlanTier } from "../lib/prisma/generated/client/index.js";
import { prisma } from "../lib/prisma/index.js";
import type { QuotaPeriodCreateDTO } from "./quota.dto.js";

class QuotaService {
  async createPeriod(input: QuotaPeriodCreateDTO) {
    return prisma.usageTracking.upsert({
      where: {
        userId_periodStart_periodEnd: {
          userId: input.userId,
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
        },
      },
      create: input,
      update: {
        imagesLimit: input.imagesLimit,
      },
    });
  }

  async assertQuotaAvailable(userId: string, count: number) {
    let usage = await this.getLastUsagePeriod(userId);

    if (!usage) {
      console.log("Quota missing → repairing from Stripe...");
      await billingService.repairQuotaFromStripe(userId);
      usage = await this.getLastUsagePeriod(userId);
    }

    if (!usage) throw new ApiError("No quota tracking found for user", 400);

    if (usage.imagesUsed + count > usage.imagesLimit)
      throw new ApiError(
        `Quota exceeded. Available ${usage.imagesLimit - usage.imagesUsed}`,
        403,
      );

    return usage;
  }

  async reserveQuotaAtomic(userId: string, count: number) {
    const usage = await this.assertQuotaAvailable(userId, count);

    return prisma.usageTracking.update({
      where: { id: usage.id },
      data: {
        imagesUsed: usage.imagesUsed + count,
      },
    });
  }

  async refundQuota(id: string, count: number) {
    await prisma.usageTracking.update({
      where: { id },
      data: {
        imagesUsed: { decrement: count },
      },
    });
  }

  async getLastUsagePeriod(userId: string) {
    const now = new Date();
    return prisma.usageTracking.findFirst({
      where: {
        userId,
        periodStart: { lte: now },
        periodEnd: { gte: now },
      },
    });
  }

  getImagesLimitByPlan(plan?: PlanTier) {
    return plan === "PRO" ? 2 : plan === "PRO_PLUS" ? 5 : 10;
  }
}

export const quotaService = new QuotaService();
