'use client';

import { Model } from '@/types';

interface ModelSelectorProps {
    selectedModel: Model;
    onSelectModel: (model: Model) => void;
}

const models: { id: Model; label: string }[] = [
    { id: 'openai', label: 'OpenAI DALL-E 3' },
    { id: 'gemini', label: 'Google Gemini' },
    { id: 'stable-diffusion', label: 'Stable Diffusion XL' },
];

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
    return (
        <div className="w-full max-w-md mx-auto mb-12">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white/80">AI Model</label>
                <span className="px-2 py-0.5 rounded textxs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    Sandbox Mode
                </span>
            </div>

            <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1">
                {models.map((model) => (
                    <button
                        key={model.id}
                        onClick={() => onSelectModel(model.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedModel === model.id
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {model.label.split(' ')[0]} {/* Show short name on mobile/small screens if needed, strictly simpler */}
                        <span className="hidden sm:inline"> {model.label.split(' ').slice(1).join(' ')}</span>
                    </button>
                ))}
            </div>
            <p className="mt-2 text-xs text-center text-white/40">
                All models are currently running in limited sandbox mode.
            </p>
        </div>
    );
}
