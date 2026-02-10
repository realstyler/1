import axios from "axios";
import type { ImageGenerationProviderI } from "../interfaces/imageGenerationProvider.js";
import { environment } from "../config/environment.js";

class StableDiffusionProvider implements ImageGenerationProviderI {
  async generateImage({
    blob,
    prompt,
  }: {
    base64Image: string;
    blob: Blob;
    mimeType: string;
    prompt: string;
  }) {
    const payload = {
      image: blob,
      mode: "image-to-image",
      prompt,
      output_format: "png",
      strength: 0.65,
    };

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: () => true,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${environment.SD_API_KEY}`,
          Accept: "image/*",
        },
      },
    );

    if (response.status === 200) {
      return Buffer.from(response.data, "base64");
    } else {
      console.error(response.data.toString());
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  }
}

export const stableDiffusionProvider = new StableDiffusionProvider();
