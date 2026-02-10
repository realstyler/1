'use client';

import Image from 'next/image';
import { useState, useRef, useCallback } from 'react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
}

export default function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeLabel = "Before",
    afterLabel = "After"
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
    }, []);

    const handleMouseDown = useCallback(() => {
        isDragging.current = true;
    }, []);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging.current) {
            handleMove(e.clientX);
        }
    }, [handleMove]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    }, [handleMove]);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* After image (background) */}
            <div className="absolute inset-0">
                <Image
                    src={afterImage}
                    alt="After styling"
                    fill
                    className="object-cover"
                    unoptimized
                />
                <div className="absolute bottom-4 right-4 bg-white text-black px-3 py-1.5 rounded-full text-xs font-medium">
                    {afterLabel}
                </div>
            </div>

            {/* Before image (clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
            >
                <div className="relative w-full h-full" style={{ width: `${100 / (sliderPosition / 100)}%` }}>
                    <Image
                        src={beforeImage}
                        alt="Before styling"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                    {beforeLabel}
                </div>
            </div>

            {/* Slider handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
