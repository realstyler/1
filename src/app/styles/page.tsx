'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { StyleGrid } from '@/components/styles';
import ModelSelector from '@/components/styles/ModelSelector';
import { mockStyles, sampleRoomImage } from '@/data/mock';
import { Style, Model } from '@/types';

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
    const [selectedModel, setSelectedModel] = useState<Model>('openai');
    const [uploadedImage] = useState<string>(getInitialUploadedImage);

    const handleSelectStyle = (style: Style) => {
        setSelectedStyle(style);
    };

    const handleSelectModel = (model: Model) => {
        setSelectedModel(model);
        sessionStorage.setItem('selectedModel', model);
    };

    const handleContinue = () => {
        if (selectedStyle) {
            sessionStorage.setItem('selectedStyle', JSON.stringify(selectedStyle));
            router.push('/processing');
        }
    };

    return (
        <div className="min-h-screen py-32 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-zinc-900 mb-6">Choose Your Style</h1>
                    <p className="text-zinc-500 max-w-xl mx-auto text-lg font-light">
                        Select the interior design style you want to apply to your room.
                        Each style has been curated by professional designers.
                    </p>
                </div>

                {/* Model Selector */}
                <ModelSelector
                    selectedModel={selectedModel}
                    onSelectModel={handleSelectModel}
                />

                {/* Current Image Preview */}
                {uploadedImage && (
                    <div className="mb-16">
                        <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase text-center mb-4">Your room</p>
                        <div className="relative w-full max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
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
                <div className="mb-16">
                    <StyleGrid
                        styles={mockStyles}
                        selectedStyle={selectedStyle}
                        onSelectStyle={handleSelectStyle}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pb-20">
                    <Link
                        href="/upload"
                        className="px-8 py-3 text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
                    >
                        Change Photo
                    </Link>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedStyle}
                        className={`px-10 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${selectedStyle
                            ? 'bg-zinc-900 text-white hover:bg-black shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5'
                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            }`}
                    >
                        APPLY STYLE
                    </button>
                </div>

                {/* Selected Style Info */}
                {selectedStyle && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl p-6 rounded-2xl max-w-md w-full mx-4 text-center animate-in slide-in-from-bottom-4 fade-in">
                        <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-2">Selected style</p>
                        <h3 className="text-xl font-serif font-medium text-zinc-900">{selectedStyle.name}</h3>
                        <p className="text-zinc-500 text-sm mt-1">{selectedStyle.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
