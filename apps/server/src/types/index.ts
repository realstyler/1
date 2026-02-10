import type { MODELS } from "../constants.js";

export type Model = (typeof MODELS)[number];

export type JobStatus =
  | "pending"
  | "completed"
  | "failed"
  | "completed_with_errors";

export type Job<T = any> = {
  id: string;
  status: JobStatus;
  input: any; // data transferred for generation (images, prompts, etc.)
  result?: T; // generation result (URL, base64, etc.)
  error?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateJob<T = any> = Partial<
  Pick<Job<T>, "status" | "result" | "error">
>;

export type UploadedImage = {
  id: string;
  path: string;
  url: string;
};

export type UploadBufferParams = {
  buffer: Buffer;
  mimeType: string;
  filePath: string;
};
