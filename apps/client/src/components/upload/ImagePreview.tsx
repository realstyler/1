'use client';

import Image from 'next/image';

interface ImagePreviewProps {
    src: string;
    name: string;
    onRemove: () => void;
}

export default function ImagePreview({ src, name, onRemove }: ImagePreviewProps) {
    return (
        <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden bg-black/50 group">
            <Image
                src={src}
                alt={name}
                fill
                className="object-cover"
                unoptimized
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Remove button */}
            <button
                onClick={onRemove}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/50 transition-all duration-200"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {/* File info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white/80 text-sm font-medium truncate max-w-xs">
                    {name}
                </span>
                <span className="text-white/50 text-xs">
                    Ready to style
                </span>
            </div>
        </div>
    );
}
