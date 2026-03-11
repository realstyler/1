'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect } from 'react';

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

    const handleTouchStart = useCallback(() => {
        isDragging.current = true;
    }, []);

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging.current) {
                handleMove(e.clientX);
            }
        };

        const handleGlobalTouchMove = (e: TouchEvent) => {
            if (isDragging.current) {
                handleMove(e.touches[0].clientX);
            }
        };

        const handleGlobalMouseUp = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('touchmove', handleGlobalTouchMove);
        window.addEventListener('touchend', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('touchend', handleGlobalMouseUp);
        };
    }, [handleMove]);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-4/3 cursor-ew-resize select-none rounded-sm overflow-hidden"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {/* After image (background) */}
            <div className="absolute inset-0">
                <Image
                    src={afterImage}
                    alt="After styling"
                    fill
                    className="object-cover"
                    unoptimized
                    draggable={false}
                />
                <div className="absolute bottom-5 right-5 bg-white text-[#1a1a1a] px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
                    {afterLabel}
                </div>
            </div>

            {/* Before image (clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
            >
                <div className="relative w-full h-full" style={{ width: `${100 / (Math.max(0.01, sliderPosition) / 100)}%` }}>
                    <Image
                        src={beforeImage}
                        alt="Before styling"
                        fill
                        className="object-cover"
                        unoptimized
                        draggable={false}
                    />
                    <div className="absolute bottom-5 left-5 bg-[#1a1a1a] text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
                        {beforeLabel}
                    </div>
                </div>
            </div>

            {/* Slider handle */}
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/50 shadow-lg cursor-ew-resize z-10"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4.5 h-10 rounded-full bg-white/80 border border-white shadow-lg flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </div>
            </div>
        </div>
    );
}