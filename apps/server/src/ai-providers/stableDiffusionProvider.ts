import ApiError from "../errors/apiError.js";
import type { ImageGenerationProviderI } from "../interfaces/imageGenerationProvider.js";

class StableDiffusionProvider implements ImageGenerationProviderI {
  async generateImage({}: {
    base64Image: string;
    mimeType: string;
    prompt: string;
  }) {
    throw new ApiError("Stable diffusion model not allowed", 500);
  }
}

export const stableDiffusionProvider = new StableDiffusionProvider();
