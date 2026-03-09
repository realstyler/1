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

export interface StyledProjectImageDTO {
  id: string;
  originalImageId: string;
  restyledPath: string;
  lighting: Lighting | null;
  creativity: Creativity | null;
  aesthetic: Aesthetic | null;
  createdAt: string;
  restyledUrl?: string | null;
}

export interface OriginalProjectImageDTO {
  id: string;
  projectId: string;
  originalPath: string;
  orderIndex: number;
  createdAt: string;
  originalUrl?: string;
  styledImages: StyledProjectImageDTO[];
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
  originalImages: OriginalProjectImageDTO[];
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

export interface ProjectListItem {
  id: string;
  name: string;
  address: string | null;
  status: string;
  updatedAt: string;
  coverUrl: string | null;
  imagesCount: number;
}

export type UploadingStatus = "uploading" | "ready" | "error";

export type ScrapedImage = {
  url: string;
  selected: boolean;
};

export type UploadResponse = {
  id?: string;
  tmpId: string;
  path: string;
};

export interface StyledImageInput {
  restyledPath: string;
  lighting?: Lighting;
  creativity?: Creativity;
  aesthetic?: Aesthetic;
}

export interface AddProjectImageInput {
  originalPath: string;
  styledImages: StyledImageInput[];
}

type Lighting = 'NATURAL' | 'WARM' | 'AMBIENT';
type Creativity = 'SUBTLE' | 'BALANCED' | 'BOLD';
type Aesthetic = 'MODERN' | 'COASTAL' | 'MINIMAL' | 'JAPANDI' | 'INDUSTRIAL' | 'CLASSIC' | 'SCANDI' | 'BOHO' | 'RUSTIC';