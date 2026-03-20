import { StylePreset } from "shared";

export interface Style {
  preset: StylePreset;
  displayName: string;
  description: string;
  colorPalette: string | null;
  imageUrl: string | null;
}

export type UploadedImageApi = {
  tmpId: string;
  id: string;
  path: string;
  url: string;
  width?: number | null;
  height?: number | null;
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
  width?: number | null;
  height?: number | null;
  createdAt: string;
  restyledUrl?: string | null;
  restyledHighResUrl?: string | null;
}

export interface OriginalProjectImageDTO {
  id: string;
  projectId: string;
  originalPath: string;
  orderIndex: number;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  originalUrl?: string;
  originalHighResUrl?: string | null;
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
  width?: number | null;
  height?: number | null;
};

export interface StyledImageInput {
  restyledPath: string;
  lighting?: Lighting;
  creativity?: Creativity;
  aesthetic?: Aesthetic;
  width?: number | null;
  height?: number | null;
}

export interface AddProjectImageInput {
  originalPath: string;
  width?: number | null;
  height?: number | null;
  styledImages: StyledImageInput[];
}

export interface CollectionItemDTO {
  id: string;
  orderIndex: number;
  type: "RESTYLED" | "ORIGINAL" | "UNKNOWN";
  imageUrl: string | null;
  originalImageId: string | null;
  styledImageId: string | null;
  width?: number | null;
  height?: number | null;
  metadata: {
    lighting: Lighting | null;
    creativity: Creativity | null;
    aesthetic: Aesthetic | null;
  } | null;
}

export interface CollectionDTO {
  id: string;
  projectId: string;
  name: string;
  shareId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionDetailsDTO {
  id: string;
  name: string;
  shareId: string | null;
  createdAt: string;
  project: {
    id: string;
    name: string;
    address: string | null;
  } | null;
  agentProfile: {
    companyName: string | null;
    contactInfo: string | null;
    logoUrl: string | null;
  } | null;
  items: CollectionItemDTO[];
}

export interface CreateCollectionItemInput {
  originalImageId?: string;
  styledImageId?: string;
  orderIndex: number;
}

export interface CreateCollectionDTO {
  name: string;
  items: CreateCollectionItemInput[];
}

export interface UserSubscription {
  status: SubscriptionStatus;
  planTier: PlanTier;
}

type Lighting = 'NATURAL' | 'WARM' | 'AMBIENT';
type Creativity = 'SUBTLE' | 'BALANCED' | 'BOLD';
type Aesthetic = 'MODERN' | 'COASTAL' | 'MINIMAL' | 'JAPANDI' | 'INDUSTRIAL' | 'CLASSIC' | 'SCANDI' | 'BOHO' | 'RUSTIC';
type PlanTier = "PRO" | "PRO_PLUS";
type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING" | "INCOMPLETE" | "INCOMPLETE_EXPIRED";

export type FilterStatus = 'All' | 'Draft' | 'Processing' | 'Completed';