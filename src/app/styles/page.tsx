'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { StyleGrid } from '@/components/styles';
import { mockStyles, sampleRoomImage } from '@/data/mock';
import { Style } from '@/types';

// Helper to get initial uploaded image from sessionStorage
function getInitialUploadedImage(): string {
    if (typeof window === 'undefined') return sampleRoomImage;
    const stored = sessionStorage.getItem('uploadedImage');
    if (stored) {
        try {
            return JSON.parse(stored).preview || sampleRoomImage;
        } catch {
            return sampleRoomImage;
        }
    }
    return sampleRoomImage;
}

export default function StylesPage() {
    const router = useRouter();
    const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
    const [uploadedImage] = useState<string>(getInitialUploadedImage);

    const handleSelectStyle = (style: Style) => {
        setSelectedStyle(style);
    };

    const handleContinue = () => {
        if (selectedStyle) {
            sessionStorage.setItem('selectedStyle', JSON.stringify(selectedStyle));
            router.push('/processing');
        }
    };

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Choose Your Style</h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Select the interior design style you want to apply to your room.
                        Each style has been curated by professional designers.
                    </p>
                </div>

                {/* Current Image Preview */}
                {uploadedImage && (
                    <div className="mb-12">
                        <p className="text-white/40 text-sm text-center mb-4">Your room</p>
                        <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden border border-white/10">
                            <Image
                                src={uploadedImage}
                                alt="Your room"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                )}

                {/* Style Grid */}
                <div className="mb-12">
                    <StyleGrid
                        styles={mockStyles}
                        selectedStyle={selectedStyle}
                        onSelectStyle={handleSelectStyle}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/upload"
                        className="px-6 py-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
                    >
                        ← Change Photo
                    </Link>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedStyle}
                        className={`px-8 py-3 font-medium rounded-full transition-all duration-300 ${selectedStyle
                            ? 'text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25'
                            : 'text-white/40 bg-white/10 cursor-not-allowed'
                            }`}
                    >
                        Apply Style →
                    </button>
                </div>

                {/* Selected Style Info */}
                {selectedStyle && (
                    <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-center">
                        <p className="text-white/40 text-sm mb-2">Selected style</p>
                        <h3 className="text-xl font-semibold text-white">{selectedStyle.name}</h3>
                        <p className="text-white/60 mt-1">{selectedStyle.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
