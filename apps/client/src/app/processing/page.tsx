'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar, ProcessingSpinner } from '@/components/processing';
import { processingStages } from '../../data/mock';

// Helper to get initial style name from sessionStorage
function getInitialStyleName(): string {
    if (typeof window === 'undefined') return '';
    const storedStyle = sessionStorage.getItem('selectedStyle');
    if (storedStyle) {
        try {
            return JSON.parse(storedStyle).name || '';
        } catch {
            return '';
        }
    }
    return '';
}

export default function ProcessingPage() {
    const router = useRouter();
    const [styleName] = useState(getInitialStyleName);
    const [images, setImages] = useState<{ id: string; preview: string; progress: number; status: 'queued' | 'processing' | 'completed' }[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Load images
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('uploadedImages');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setImages(parsed.map((img: any) => ({ ...img, progress: 0, status: 'queued' })));
                } catch {
                    setImages([]);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (images.length === 0) return;

        // Simulate parallel processing
        const interval = setInterval(() => {
            setImages(prev => {
                const newState = prev.map(img => {
                    if (img.status === 'completed') return img;

                    if (img.status === 'queued') {
                        // Random chance to start processing
                        if (Math.random() > 0.7) return { ...img, status: 'processing' as const, progress: 5 };
                        return img;
                    }

                    if (img.status === 'processing') {
                        const newProgress = img.progress + Math.random() * 15;
                        if (newProgress >= 100) return { ...img, progress: 100, status: 'completed' as const };
                        return { ...img, progress: newProgress };
                    }
                    return img;
                });

                // Check completion
                const allComplete = newState.every(img => img.status === 'completed');
                if (allComplete && !isComplete) {
                    setIsComplete(true);
                }

                return newState;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [images.length, isComplete]);

    // Handle initial kick-off for first image
    useEffect(() => {
        if (images.length > 0 && images.every(i => i.status === 'queued')) {
            setTimeout(() => {
                setImages(prev => {
                    const newImages = [...prev];
                    if (newImages[0]) newImages[0].status = 'processing';
                    return newImages;
                });
            }, 500);
        }
    }, [images]);

    // Redirect when complete logic
    useEffect(() => {
        if (isComplete) {
            // Save to history
            const storedStyle = sessionStorage.getItem('selectedStyle');
            const style = storedStyle ? JSON.parse(storedStyle) : null;

            const historyItem = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                styleName: style?.name || 'Unknown Style',
                imageCount: images.length,
                images: images.map(img => img.preview) // Saving data URLs to local storage (not ideal for prod but ok for demo)
            };

            const existingHistory = JSON.parse(localStorage.getItem('designHistory') || '[]');
            localStorage.setItem('designHistory', JSON.stringify([historyItem, ...existingHistory]));

            const timeout = setTimeout(() => {
                router.push('/viewer');
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [isComplete, images, router]);

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    {/* Spinner */}
                    <div className="flex justify-center mb-8">
                        <ProcessingSpinner />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">
                        {isComplete ? 'All Done!' : 'Transforming Your Rooms'}
                    </h1>
                    {styleName && (
                        <p className="text-violet-400 font-medium mb-2">
                            Applying {styleName} style
                        </p>
                    )}
                    <p className="text-white/60">
                        {isComplete ? 'Redirecting to results...' : 'Our AI is generating your new designs in parallel.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((img, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                            <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.preview} alt={`Room ${idx + 1}`} className="w-full h-full object-cover opacity-60" />
                                {img.status === 'completed' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-white/80">Room {idx + 1}</span>
                                    <span className="text-xs text-white/50 uppercase">{img.status}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${img.status === 'completed' ? 'bg-green-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                                            }`}
                                        style={{ width: `${img.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
