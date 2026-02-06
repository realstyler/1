import ApiError from "../errors/apiError.js";
import { environment } from "../config/environment.js";
import { imageUploadService } from "../upload/imageUpload.service.js";
import type { Model } from "../types/index.js";
import { geminiProvider } from "../ai-providers/geminiProvider.js";
import { mockGenProvider } from "../ai-providers/mockGenProvider.js";
import { openaiProvider } from "../ai-providers/openaiProvider.js";
import { stableDiffusionProvider } from "../ai-providers/stableDiffusionProvider.js";
import { jobService } from "../job-pooling/job.service.js";
import type { StylePreset } from "../lib/prisma/generated/client/index.js";
import { promptCacheService } from "../prompts/prompts.service.js";
import { RestyleSchema } from "./ai.schemas.js";
import { zodParseOrThrow } from "../utils/zodParseOrThrow.util.js";

class AIGenerationService {
  // every user has the opportunity to restyle
  async restyle(input: {
    images: { path: string; mimeType: string }[];
    model: Model;
    style: StylePreset;
  }) {
    const { model, style, images } = zodParseOrThrow(RestyleSchema, input);
    const jobIds: string[] = [];

    for (const img of images) {
      const jobId = await jobService.createJob({ img, model, style });
      jobIds.push(jobId);

      setImmediate(async () => {
        try {
          const result = await this.restyleByProvider(img, model, style);
          await jobService.completeJob(jobId, result);
        } catch (err: any) {
          await jobService.updateJob(jobId, {
            status: "failed",
            error: err.message,
          });
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
        throw new ApiError(`Unsupported model: ${model}`, 400);
    }
  }

  private async generateImage(
    model: Model,
    data: {
      base64Image: string;
      blob: Blob;
      mimeType: string;
      prompt: string;
    },
  ) {
    const provider = this.getProvider(model);
    return provider.generateImage(data);
  }
}

export const aiGenerationService = new AIGenerationService();
