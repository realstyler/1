'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dropzone, ImagePreview } from '@/components/upload';
import { sampleRoomImage } from '@/data/mock';

interface UploadedFile {
    id: string;
    file: File | null; // null for sample image
    preview: string;
    name: string;
    status: 'uploading' | 'ready' | 'error';
}

const MAX_FILES = 5;

export default function UploadPage() {
    const router = useRouter();
    const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
    const [isGlobalUploading, setIsGlobalUploading] = useState(false);

    const handleImageSelect = async (files: File[]) => {
        if (files.length === 0) return;

        const remainingSlots = MAX_FILES - uploadedImages.length;
        if (remainingSlots <= 0) return;

        const filesToProcess = files.slice(0, remainingSlots);
        setIsGlobalUploading(true);

        const newUploads: UploadedFile[] = filesToProcess.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file), // Temporary preview
            name: file.name,
            status: 'uploading'
        }));

        setUploadedImages(prev => [...prev, ...newUploads]);

        // Simulate upload delay for each file
        // In a real app, this would be actual upload logic
        setTimeout(() => {
            setUploadedImages(prev => prev.map(img =>
                newUploads.find(nu => nu.id === img.id)
                    ? { ...img, status: 'ready' }
                    : img
            ));
            setIsGlobalUploading(false);
        }, 2000);
    };

    const handleRemove = (id: string) => {
        setUploadedImages(prev => prev.filter(img => img.id !== id));
    };

    const handleUseSample = () => {
        if (uploadedImages.length >= MAX_FILES) return;

        const sampleId = Math.random().toString(36).substring(7);
        const sampleImage: UploadedFile = {
            id: sampleId,
            file: null,
            preview: sampleRoomImage,
            name: 'sample-room.jpg',
            status: 'ready'
        };

        setUploadedImages(prev => [...prev, sampleImage]);
    };

    const handleContinue = () => {
        if (uploadedImages.length > 0 && !isGlobalUploading) {
            // For demo, just store the first "ready" image or all of them
            // In a real app, you'd pass IDs or URLs
            // Store all ready images
            const readyImages = uploadedImages.filter(img => img.status === 'ready');
            if (readyImages.length > 0) {
                sessionStorage.setItem('uploadedImages', JSON.stringify(readyImages.map(img => ({
                    id: img.id,
                    preview: img.preview,
                    name: img.name
                }))));
                // Keep legacy single image support for safety until full migration
                sessionStorage.setItem('uploadedImage', JSON.stringify({
                    preview: readyImages[0].preview,
                    name: readyImages[0].name
                }));
                router.push('/styles');
            }
        }
    };

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Upload Your Room</h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Upload up to {MAX_FILES} photos of the rooms you want to transform.
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="space-y-8">
                    {/* Upload Area - Always visible if under limit */}
                    {uploadedImages.length < MAX_FILES && (
                        <div className={uploadedImages.length > 0 ? "max-w-2xl mx-auto" : ""}>
                            <Dropzone onImageSelect={handleImageSelect} />
                        </div>
                    )}

                    {/* Image Grid */}
                    {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {uploadedImages.map((img) => (
                                <div key={img.id} className="relative">
                                    <ImagePreview
                                        src={img.preview}
                                        name={img.name}
                                        onRemove={() => handleRemove(img.id)}
                                    />
                                    {img.status === 'uploading' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-sm z-20">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-2" />
                                                <span className="text-sm font-medium text-white">Uploading...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Sample Image Option (only if empty) */}
                    {uploadedImages.length === 0 && (
                        <div className="text-center">
                            <p className="text-white/40 mb-4">or</p>
                            <button
                                onClick={handleUseSample}
                                className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                            >
                                Use a sample image →
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="px-6 py-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
                    >
                        ← Back
                    </Link>
                    <button
                        onClick={handleContinue}
                        disabled={uploadedImages.length === 0 || isGlobalUploading}
                        className={`px-8 py-3 font-medium rounded-full transition-all duration-300 ${uploadedImages.length > 0 && !isGlobalUploading
                            ? 'text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25'
                            : 'text-white/40 bg-white/10 cursor-not-allowed'
                            }`}
                    >
                        {isGlobalUploading ? 'Uploading...' : 'Choose Style →'}
                    </button>
                </div>

                {/* Tips */}
                <div className="mt-16 max-w-2xl mx-auto p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tips for best results
                    </h3>
                    <ul className="space-y-2 text-white/60 text-sm">
                        <li>• Use a well-lit photo for better AI recognition</li>
                        <li>• Capture the entire room for more accurate transformations</li>
                        <li>• Avoid photos with people or pets for cleaner results</li>
                        <li>• Higher resolution images produce better quality outputs</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
