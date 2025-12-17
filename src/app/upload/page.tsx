'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dropzone, ImagePreview } from '@/components/upload';
import { sampleRoomImage } from '@/data/mock';

export default function UploadPage() {
    const router = useRouter();
    const [uploadedImage, setUploadedImage] = useState<{ file: File | null; preview: string; name: string } | null>(null);

    const handleImageSelect = (file: File, preview: string) => {
        setUploadedImage({ file, preview, name: file.name });
    };

    const handleRemove = () => {
        setUploadedImage(null);
    };

    const handleUseSample = () => {
        setUploadedImage({ file: null, preview: sampleRoomImage, name: 'sample-room.jpg' });
    };

    const handleContinue = () => {
        // Store in sessionStorage for demo purposes
        if (uploadedImage) {
            sessionStorage.setItem('uploadedImage', JSON.stringify(uploadedImage));
            router.push('/styles');
        }
    };

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Upload Your Room</h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Start by uploading a photo of the room you want to transform.
                        Don&apos;t have one ready? Use our sample image to try it out.
                    </p>
                </div>

                {/* Upload Area */}
                <div className="mb-8">
                    {uploadedImage ? (
                        <ImagePreview
                            src={uploadedImage.preview}
                            name={uploadedImage.name}
                            onRemove={handleRemove}
                        />
                    ) : (
                        <Dropzone onImageSelect={handleImageSelect} />
                    )}
                </div>

                {/* Sample Image Option */}
                {!uploadedImage && (
                    <div className="text-center mb-8">
                        <p className="text-white/40 mb-4">or</p>
                        <button
                            onClick={handleUseSample}
                            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                        >
                            Use a sample image →
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="px-6 py-3 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
                    >
                        ← Back
                    </Link>
                    <button
                        onClick={handleContinue}
                        disabled={!uploadedImage}
                        className={`px-8 py-3 font-medium rounded-full transition-all duration-300 ${uploadedImage
                                ? 'text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25'
                                : 'text-white/40 bg-white/10 cursor-not-allowed'
                            }`}
                    >
                        Choose Style →
                    </button>
                </div>

                {/* Tips */}
                <div className="mt-16 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tips for best results
                    </h3>
                    <ul className="space-y-2 text-white/60 text-sm">
                        <li>• Use a well-lit photo for better AI recognition</li>
                        <li>• Capture the entire room for more accurate transformations</li>
                        <li>• Avoid photos with people or pets for cleaner results</li>
                        <li>• Higher resolution images produce better quality outputs</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
