'use client';

import { useCallback, useState } from 'react';

interface DropzoneProps {
    onImageSelect: (file: File, preview: string) => void;
}

export default function Dropzone({ onImageSelect }: DropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        onImageSelect(file, reader.result as string);
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        [onImageSelect]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = () => {
                    onImageSelect(file, reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        [onImageSelect]
    );

    return (
        <div
            className={`relative w-full max-w-2xl mx-auto aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragging
                    ? 'border-violet-500 bg-violet-500/10 scale-[1.02]'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                {/* Upload Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                    <svg
                        className="w-8 h-8 text-violet-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                    Drop your room photo here
                </h3>
                <p className="text-white/50 text-center mb-4">
                    or click to browse from your device
                </p>
                <p className="text-white/30 text-sm">
                    Supports JPG, PNG, WebP • Max 10MB
                </p>
            </div>

            {/* Animated border gradient */}
            {isDragging && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 animate-pulse" />
                </div>
            )}
        </div>
    );
}
