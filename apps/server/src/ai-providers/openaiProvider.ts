import ApiError from "../errors/apiError.js";
import type { ImageGenerationProviderI } from "../interfaces/imageGenerationProvider.js";

class OpenaiProvider implements ImageGenerationProviderI {
  async generateImage({}: {
    base64Image: string;
    blob: Blob;
    mimeType: string;
    prompt: string;
  }) {
    throw new ApiError("Openai model not allowed", 500);
  }
}

export const openaiProvider = new OpenaiProvider();
