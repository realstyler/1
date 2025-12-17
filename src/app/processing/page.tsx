'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar, ProcessingSpinner } from '@/components/processing';
import { processingStages } from '@/data/mock';

export default function ProcessingPage() {
    const router = useRouter();
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [styleName, setStyleName] = useState('');

    useEffect(() => {
        // Get selected style name
        const storedStyle = sessionStorage.getItem('selectedStyle');
        if (storedStyle) {
            const style = JSON.parse(storedStyle);
            setStyleName(style.name);
        }

        // Simulate processing stages
        const interval = setInterval(() => {
            setCurrentStageIndex((prev) => {
                if (prev < processingStages.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    // Redirect when complete
    useEffect(() => {
        if (currentStageIndex === processingStages.length - 1) {
            const timeout = setTimeout(() => {
                router.push('/viewer');
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [currentStageIndex, router]);

    const currentStage = processingStages[currentStageIndex];

    return (
        <div className="min-h-screen flex items-center justify-center py-20">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative z-10">
                    {/* Spinner */}
                    <div className="flex justify-center mb-8">
                        <ProcessingSpinner />
                    </div>

                    {/* Status */}
                    <h1 className="text-3xl font-bold mb-4">
                        {currentStage.stage === 'complete' ? 'All Done!' : 'Transforming Your Room'}
                    </h1>

                    {styleName && (
                        <p className="text-violet-400 font-medium mb-2">
                            Applying {styleName} style
                        </p>
                    )}

                    <p className="text-white/60 mb-8 h-6">
                        {currentStage.message}
                    </p>

                    {/* Progress bar */}
                    <ProgressBar progress={currentStage.progress} />

                    {/* Stage indicators */}
                    <div className="mt-12 flex justify-center gap-4">
                        {processingStages.slice(0, -1).map((stage, index) => (
                            <div
                                key={stage.stage}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index <= currentStageIndex
                                        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                                        : 'bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Fun facts while waiting */}
                    <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-white/40 text-sm mb-2">Did you know?</p>
                        <p className="text-white/70">
                            Our AI analyzes over 10,000 design elements to create
                            the perfect transformation for your space.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
