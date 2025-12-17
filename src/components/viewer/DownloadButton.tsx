'use client';

interface DownloadButtonProps {
    imageUrl: string;
    filename?: string;
}

export default function DownloadButton({ imageUrl, filename = 'styled-room.jpg' }: DownloadButtonProps) {
    const handleDownload = () => {
        // In a real app, this would trigger an actual download
        // For mock, we just show an alert with the details
        console.log('Downloading:', imageUrl);
        alert(`Download started: ${filename} (Mock functionality)`);
    };

    return (
        <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-violet-500/25"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Result
        </button>
    );
}
