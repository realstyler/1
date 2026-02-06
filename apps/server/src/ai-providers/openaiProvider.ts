import OpenAI from "openai";
import type { ImageGenerationProviderI } from "../interfaces/imageGenerationProvider.js";
import { environment } from "../config/environment.js";

class OpenaiProvider implements ImageGenerationProviderI {
  private openai = new OpenAI({
    apiKey: environment.OPENAI_API_KEY,
  });

  async generateImage({
    blob,
    prompt,
  }: {
    base64Image: string;
    blob: Blob;
    mimeType: string;
    prompt: string;
  }) {
    const result = await this.openai.images.edit({
      model: "gpt-image-1",
      image: blob,
      prompt,
    });

    const image_base64 = result.data?.[0]?.b64_json;
    if (!image_base64) throw new Error("No image returned from Openai");

    return Buffer.from(image_base64, "base64");
  }
}

export const openaiProvider = new OpenaiProvider();
