// Types for RealStyler UI

export interface Style {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    category: 'modern' | 'classic' | 'minimalist' | 'bold' | 'luxury' | 'lighting';
}

export type Model = 'openai' | 'gemini' | 'stable-diffusion';

export interface UploadedImage {
    id: string;
    file: File | null;
    preview: string;
    name: string;
}

export interface ProcessingStatus {
    stage: 'uploading' | 'analyzing' | 'styling' | 'finalizing' | 'complete';
    progress: number;
    message: string;
}

export interface AppState {
    uploadedImage: UploadedImage | null;
    selectedStyle: Style | null;
    processingStatus: ProcessingStatus | null;
    resultImage: string | null;
}
