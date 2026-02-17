import fs from "fs";
import path from "path";
import type { ImageGenerationProviderI } from "../interfaces/imageGenerationProvider.js";
import { delay } from "shared";

class MockGeminiProvider implements ImageGenerationProviderI {
  async generateImage({}: {
    base64Image: string;
    blob: Blob;
    mimeType: string;
    prompt: string;
  }) {
    await delay(4000);
    return fs.readFileSync(path.resolve("./src/__mocks__/mock-generated.png"));
  }
}

export const mockGenProvider = new MockGeminiProvider();
