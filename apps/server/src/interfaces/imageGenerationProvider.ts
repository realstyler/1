export interface ImageGenerationProviderI {
  generateImage(input: {
    base64Image: string;
    mimeType: string;
    prompt: string;
  }): Promise<Buffer | void> | void;
}
