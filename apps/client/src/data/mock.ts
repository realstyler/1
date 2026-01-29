import { Style, ProcessingStatus } from '@/types';

export const mockStyles: Style[] = [
    {
        id: 'modern-living',
        name: 'Modern Living Room',
        description: 'Sleek contemporary design with clean lines and comfort',
        thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
        category: 'modern',
    },
    {
        id: 'minimalist',
        name: 'Minimalist Interior',
        description: 'Clutter-free aesthetic focusing on simplicity and functionality',
        thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=300&fit=crop',
        category: 'minimalist',
    },
    {
        id: 'luxury',
        name: 'Luxury Staging',
        description: 'Premium textures, elegant lighting, and sophisticated contrast',
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
        category: 'luxury',
    },
    {
        id: 'daylight',
        name: 'Bright Daylight',
        description: 'Enhance natural light and airy atmosphere',
        thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop',
        category: 'lighting',
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
    'modern-living': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    'minimalist': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop',
    'luxury': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'daylight': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&h=600&fit=crop',
};

// Sample room image for demo
export const sampleRoomImage = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop';
