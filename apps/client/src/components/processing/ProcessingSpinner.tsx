'use client';

export default function ProcessingSpinner() {
    return (
        <div className="relative w-24 h-24">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />

            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 border-r-fuchsia-500 animate-spin" />

            {/* Inner glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 animate-pulse" />

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        </div>
    );
}
