import fs from "fs";
import path from "path";
import type { ImageGenerationProviderI } from "../interfaces/imageGenerationProvider.js";

class MockGeminiProvider implements ImageGenerationProviderI {
  async generateImage({}: {
    base64Image: string;
    blob: Blob;
    mimeType: string;
    prompt: string;
  }) {
    return fs.readFileSync(path.resolve("./src/__mocks__/mock-generated.png"));
  }
}

export const mockGenProvider = new MockGeminiProvider();
