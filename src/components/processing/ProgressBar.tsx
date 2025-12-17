'use client';

interface ProgressBarProps {
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="mt-2 flex justify-between text-sm">
                <span className="text-white/50">Processing</span>
                <span className="text-white font-medium">{progress}%</span>
            </div>
        </div>
    );
}
