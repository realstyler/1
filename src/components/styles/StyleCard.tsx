'use client';

import Image from 'next/image';
import { Style } from '@/types';

interface StyleCardProps {
    style: Style;
    isSelected: boolean;
    onSelect: (style: Style) => void;
}

export default function StyleCard({ style, isSelected, onSelect }: StyleCardProps) {
    return (
        <button
            onClick={() => onSelect(style)}
            className={`group relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 ${isSelected
                    ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-black scale-[1.02]'
                    : 'hover:scale-[1.02]'
                }`}
        >
            {/* Image */}
            <Image
                src={style.thumbnail}
                alt={style.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg mb-1">{style.name}</h3>
                <p className="text-white/60 text-sm line-clamp-2">{style.description}</p>

                {/* Category badge */}
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm rounded-full">
                    {style.category}
                </span>
            </div>
        </button>
    );
}
