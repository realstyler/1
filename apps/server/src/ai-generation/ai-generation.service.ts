import { environment } from "../config/environment.js";
import { imageUploadService } from "../upload/image-upload.service.js";
import type { Model } from "../types/index.js";
import { geminiProvider } from "../ai-providers/geminiProvider.js";
import { mockGenProvider } from "../ai-providers/mockGenProvider.js";
import { openaiProvider } from "../ai-providers/openaiProvider.js";
import { stableDiffusionProvider } from "../ai-providers/stableDiffusionProvider.js";
import { jobService } from "../job-pooling/job.service.js";
import type { StylePreset } from "@prisma/client";
import { promptCacheService } from "../prompts/prompts.service.js";
import { RestyleSchema } from "./ai.schemas.js";
import { quotaService } from "../quota/quota.service.js";
import { BadRequestError } from "../errors/apiErrors.js";
import { zodParseOrThrow } from "shared";

class AIGenerationService {
  // every user has the opportunity to restyle
  async restyle(
    userId: string,
    input: {
      images: { path: string; mimeType: string }[];
      model: Model;
      style: StylePreset;
    },
  ) {
    const { model, style, images } = zodParseOrThrow(RestyleSchema, input);
    const jobIds: string[] = [];

    const reservedQuota = await quotaService.reserveQuotaAtomic(
      userId,
      images.length,
    );

    for (const img of images) {
      const jobId = await jobService.createJob({ img, model, style });
      jobIds.push(jobId);

      setImmediate(async () => {
        const startRestyle = async () => {
          const result = await this.restyleByProvider(img, model, style); // generate or throw error
          await jobService.completeJob(jobId, result);
        };

        try {
          await startRestyle();
        } catch (err: any) {
          console.error(
            `Failed to generate restyle for image ${img.path}, model: ${model}, style: ${style}, jobId: ${jobId}`,
          );
          console.error(err);

          try {
            await jobService.updateJob(jobId, {
              status: "failed",
              error: err.message,
            });

            console.log("Trying auto restyle");

            await startRestyle();
          } catch (err: any) {
            console.error(
              `Failed to generate restyle for image ${img.path}, model: ${model}, style: ${style}, jobId: ${jobId}`,
            );
            console.error(err);

            await quotaService.refundQuota(reservedQuota.id, 1);
            await jobService.updateJob(jobId, {
              status: "failed_final",
              error: err.message,
            });
          }
        }
      });
    }

    return jobIds;
  }

  private async restyleByProvider(
    image: { path: string; mimeType: string },
    model: Model,
    style: StylePreset,
  ) {
    const blob = await imageUploadService.downloadImage(image.path);
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const prompt = promptCacheService.get(style);

    const generatedBuffer = await this.generateImage(model, {
      base64Image,
      blob,
      buffer,
      mimeType: image.mimeType,
      prompt,
    });

    if (!generatedBuffer) throw new Error("Failed to generate image");

    return await imageUploadService.uploadGeneratedImage({
      buffer: generatedBuffer,
      mimeType: "image/png", // Models always return png
    });
  }

  private getProvider(model: Model) {
    if (environment.USE_MOCK_AI) {
      return mockGenProvider;
    }

    switch (model) {
      case "gemini":
        return geminiProvider;
      case "openai":
        return openaiProvider;
      case "stable-diffusion":
        return stableDiffusionProvider;
      default:
        throw new BadRequestError(`Unsupported model: ${model}`);
    }
  }

  private async generateImage(
    model: Model,
    data: {
      base64Image: string;
      blob: Blob;
      buffer: Buffer<ArrayBuffer>;
      mimeType: string;
      prompt: string;
    },
  ) {
    const provider = this.getProvider(model);
    return provider.generateImage(data);
  }
}

export const aiGenerationService = new AIGenerationService();
