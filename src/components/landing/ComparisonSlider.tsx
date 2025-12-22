'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ComparisonSliderProps {
    beforeDetails: { src: string; label: string };
    afterDetails: { src: string; label: string };
}

export default function ComparisonSlider({ beforeDetails, afterDetails }: ComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    const handleMouseDown = () => setIsDragging(true);


    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent) => {
            if (isDragging) {
                handleMove(e.clientX);
            }
        };
        const handleGlobalUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] overflow-hidden select-none group cursor-ew-resize"
            onClick={(e) => handleMove(e.clientX)}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
                <Image
                    src={afterDetails.src}
                    alt={afterDetails.label}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-wider uppercase shadow-lg z-10 pointer-events-none">
                    {afterDetails.label}
                </div>
            </div>

            {/* Before Image (Foreground - Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <Image
                    src={beforeDetails.src}
                    alt={beforeDetails.label}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-6 left-6 px-4 py-2 bg-zinc-900/90 backdrop-blur-sm rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-lg z-10 pointer-events-none">
                    {beforeDetails.label}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-transform group-active:scale-110"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                    <svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
