// Types for RealStyler UI

import { StylePreset } from "shared";

export interface Style {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: StylePreset;
}

export type UploadedImageApi = {
  tmpId: string;
  id: string;
  path: string;
  url: string;
};

export type StoredPath = { id: string; name: string; path: string };

export interface UploadedImage {
  id: string;
  file: File | null;
  preview: string;
  name: string;
}

export interface ProcessingStatus {
  stage: "uploading" | "analyzing" | "styling" | "finalizing" | "complete";
  progress: number;
  message: string;
}

export interface AppState {
  uploadedImage: UploadedImage | null;
  selectedStyle: Style | null;
  processingStatus: ProcessingStatus | null;
  resultImage: string | null;
}

export interface ProjectImageDTO {
  id: string;
  createdAt: string;
  projectId: string;
  originalPath: string;
  restyledPath: string;
  orderIndex: number;
  originalUrl?: string; 
  restyledUrl?: string;
}

export interface ProjectDTO {
  id: string;
  shareId: string | null;
  userId: string;
  name: string;
  address: string | null;
  stylePreset: StylePreset | null;
  createdAt: string;
  updatedAt: string;
  images: ProjectImageDTO[];
}

export interface Project {
  id: string;
  title: string;
  address: string;
  imagesCount: number;
  updatedAt: string;
  status: "Processing" | "Draft" | "Completed";
  imageUrl: string;
}

export interface UploadedFile {
  id: string;
  file: File | null;
  preview: string;
  name: string;
  status: UploadingStatus;
  path?: string;
}

export type UploadingStatus = "uploading" | "ready" | "error";