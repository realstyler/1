import { GoogleGenAI } from "@google/genai";
import type { ImageGenerationProviderI } from "../interfaces/imageGenerationProvider.js";
import { environment } from "../config/environment.js";

class GeminiProvider implements ImageGenerationProviderI {
  private ai = new GoogleGenAI({ apiKey: environment.GEMINI_API_KEY });

  async generateImage({
    base64Image,
    mimeType,
    prompt,
  }: {
    base64Image: string;
    mimeType: string;
    prompt: string;
  }) {
    const response = await this.ai.models.generateContent({
      model: environment.GEMINI_MODEL,
      contents: [
        { text: prompt },
        { inlineData: { data: base64Image, mimeType } },
      ],
    });

    const part = response.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData?.data,
    );

    if (!part?.inlineData?.data) {
      throw new Error("No image returned from Gemini");
    }

    return Buffer.from(part.inlineData.data, "base64");
  }
}

export const geminiProvider = new GeminiProvider();
