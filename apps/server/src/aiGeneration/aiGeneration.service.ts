import ApiError from "../errors/apiError.js";
import { environment } from "../config/environment.js";
import { imageUploadService } from "../upload/imageUpload.service.js";
import type { Model } from "../types/index.js";
import { geminiProvider } from "../ai-providers/geminiProvider.js";
import { mockGenProvider } from "../ai-providers/mockGenProvider.js";
import { openaiProvider } from "../ai-providers/openaiProvider.js";
import { stableDiffusionProvider } from "../ai-providers/stableDiffusionProvider.js";
import { jobService } from "../job-pooling/job.service.js";
import { delay } from "../utils/delay.util.js";

const generatingPrompt = `
    Interior redesign of the same room shown in the reference image.
    Keep the exact room geometry, layout, walls, ceiling height, windows, doors, perspective and camera angle unchanged.
    Do not alter the structure of the room.

    Replace all furniture, decor and interior elements with a new interior design.
    Rearrange all furniture and interior objects completely within the room while maintaining the original geometry.
    The new design must look realistic, coherent and professionally designed.

    High-quality interior design render, photorealistic lighting, natural shadows, realistic materials, interior architecture photography.
    No distortion, no changes to room proportions, no added or removed walls.


    Minimalist interior design style.
    Clean and simple design, minimal number of elements and decor.
    Neutral color palette, soft tones, simple geometric shapes.
    Modern minimalist furniture with clean lines and smooth surfaces.
    Uncluttered space, calm atmosphere, functional design.
    No ornamentation, no excessive decoration, no complex patterns.
`;

class AIGenerationService {
  async restyle(images: { path: string; mimeType: string }[], model: Model) {
    const jobIds: string[] = [];

    for (const img of images) {
      const jobId = await jobService.createJob({ img, model });
      jobIds.push(jobId);

      setImmediate(async () => {
        try {
          const result = await this.restyleByProvider(img, model);
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
  ) {
    const blob = await imageUploadService.downloadImage(image.path);
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const generatedBuffer = await this.generateImage(model, {
      base64Image,
      blob,
      mimeType: image.mimeType,
      prompt: generatingPrompt,
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
