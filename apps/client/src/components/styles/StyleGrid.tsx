'use client';

import { Style } from '@/types';
import StyleCard from './StyleCard';

interface StyleGridProps {
    styles: Style[];
    selectedStyle: Style | null;
    onSelectStyle: (style: Style) => void;
}

export default function StyleGrid({ styles, selectedStyle, onSelectStyle }: StyleGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
                <StyleCard
                    key={style.preset}
                    style={style}
                    isSelected={selectedStyle?.preset === style.preset}
                    onSelect={onSelectStyle}
                />
            ))}
        </div>
    );
}
