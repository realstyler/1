import type { MODELS } from "../constants.js";

export type Model = (typeof MODELS)[number];

export type UploadedImage = {
  tmpId: string;
  id: string;
  path: string;
  url: string;
};

export type UploadBufferParams = {
  buffer: Buffer;
  mimeType: string;
  filePath: string;
};
