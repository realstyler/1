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
                ? 'ring-4 ring-zinc-900 ring-offset-2 ring-offset-white scale-[1.02]'
                : 'hover:scale-[1.02] hover:shadow-xl'
                }`}
        >
            {/* Image */}
            <Image
                src={style.thumbnail}
                alt={style.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <h3 className="text-white font-medium text-lg mb-1">{style.name}</h3>
                <p className="text-white/80 text-sm line-clamp-2 font-light">{style.description}</p>

                {/* Category badge */}
                <span className="inline-block mt-3 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-white/90 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                    {style.category}
                </span>
            </div>
        </button>
    );
}
