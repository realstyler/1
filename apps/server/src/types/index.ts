export type UploadedImage = {
  tmpId: string;
  id: string;
  path: string;
  url: string;
};

export type GeneratedImage = {
  id: string;
  path: string;
};

export type UploadBufferParams = {
  buffer: Buffer;
  mimeType: string;
  path: string;
};

export type RequestIdentity = {
  type: "user" | "guest";
  id: string;
};