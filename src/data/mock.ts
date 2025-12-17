import { Style, ProcessingStatus } from '@/types';

export const mockStyles: Style[] = [
    {
        id: 'modern-loft',
        name: 'Modern Loft',
        description: 'Clean lines, industrial touches, urban vibes',
        thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
        category: 'modern',
    },
    {
        id: 'scandinavian',
        name: 'Scandinavian',
        description: 'Light woods, neutral tones, cozy minimalism',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        category: 'minimalist',
    },
    {
        id: 'mid-century',
        name: 'Mid-Century Modern',
        description: 'Retro vibes, bold colors, iconic furniture',
        thumbnail: 'https://images.unsplash.com/photo-1556020685-ae41b038f4fe?w=400&h=300&fit=crop',
        category: 'classic',
    },
    {
        id: 'japandi',
        name: 'Japandi',
        description: 'Japanese minimalism meets Scandinavian warmth',
        thumbnail: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop',
        category: 'minimalist',
    },
    {
        id: 'industrial',
        name: 'Industrial',
        description: 'Raw materials, exposed elements, urban edge',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
        category: 'bold',
    },
    {
        id: 'bohemian',
        name: 'Bohemian',
        description: 'Eclectic patterns, rich textures, free spirit',
        thumbnail: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=400&h=300&fit=crop',
        category: 'bold',
    },
];

export const processingStages: ProcessingStatus[] = [
    { stage: 'uploading', progress: 10, message: 'Uploading your image...' },
    { stage: 'analyzing', progress: 30, message: 'Analyzing room structure...' },
    { stage: 'styling', progress: 60, message: 'Applying style transformation...' },
    { stage: 'finalizing', progress: 90, message: 'Adding final touches...' },
    { stage: 'complete', progress: 100, message: 'Complete!' },
];

// Mock result images for demo
export const mockResultImages: Record<string, string> = {
    'modern-loft': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    'scandinavian': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'mid-century': 'https://images.unsplash.com/photo-1556020685-ae41b038f4fe?w=800&h=600&fit=crop',
    'japandi': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
    'industrial': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    'bohemian': 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&h=600&fit=crop',
};

// Sample room image for demo
export const sampleRoomImage = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop';
