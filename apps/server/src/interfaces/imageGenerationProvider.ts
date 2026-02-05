export interface ImageGenerationProviderI {
  generateImage(input: {
    base64Image: string;
    blob: Blob;
    mimeType: string;
    prompt: string;
  }): Promise<Buffer | void> | void;
}
