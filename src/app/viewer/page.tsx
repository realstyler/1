'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BeforeAfterSlider, DownloadButton } from '@/components/viewer';
import { mockResultImages, sampleRoomImage } from '@/data/mock';
import { Style } from '@/types';

export default function ViewerPage() {
    const [beforeImage, setBeforeImage] = useState<string>(sampleRoomImage);
    const [afterImage, setAfterImage] = useState<string>('');
    const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

    useEffect(() => {
        // Get data from sessionStorage
        const storedImage = sessionStorage.getItem('uploadedImage');
        const storedStyle = sessionStorage.getItem('selectedStyle');

        if (storedImage) {
            const image = JSON.parse(storedImage);
            setBeforeImage(image.preview);
        }

        if (storedStyle) {
            const style = JSON.parse(storedStyle);
            setSelectedStyle(style);
            setAfterImage(mockResultImages[style.id] || mockResultImages['modern-loft']);
        } else {
            // Default to modern-loft style
            setAfterImage(mockResultImages['modern-loft']);
        }
    }, []);

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-400 text-sm font-medium">Transformation Complete</span>
                    </div>

                    <h1 className="text-4xl font-bold mb-4">Your New Space</h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        {selectedStyle
                            ? `Here's your room transformed with the ${selectedStyle.name} style. Drag the slider to compare before and after.`
                            : 'Drag the slider to compare before and after.'}
                    </p>
                </div>

                {/* Before/After Slider */}
                {afterImage && (
                    <div className="mb-12">
                        <BeforeAfterSlider
                            beforeImage={beforeImage}
                            afterImage={afterImage}
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <DownloadButton imageUrl={afterImage} />

                    <Link
                        href="/styles"
                        className="px-6 py-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
                    >
                        Try Another Style
                    </Link>

                    <Link
                        href="/upload"
                        className="px-6 py-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
                    >
                        New Photo
                    </Link>
                </div>

                {/* Style Info Card */}
                {selectedStyle && (
                    <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{selectedStyle.name}</h3>
                                <p className="text-white/60 text-sm">{selectedStyle.description}</p>
                                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full">
                                    {selectedStyle.category}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Share Section */}
                <div className="mt-16 text-center">
                    <h3 className="text-lg font-semibold mb-4">Love your new design?</h3>
                    <div className="flex items-center justify-center gap-4">
                        {['Twitter', 'Pinterest', 'Facebook'].map((platform) => (
                            <button
                                key={platform}
                                className="px-4 py-2 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
                            >
                                Share on {platform}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
