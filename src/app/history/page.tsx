'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HistoryItem {
    id: string;
    date: string;
    styleName: string;
    imageCount: number;
    images: string[];
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('designHistory');
            if (stored) {
                try {
                    setHistory(JSON.parse(stored));
                } catch {
                    setHistory([]);
                }
            }
        }
    }, []);

    return (
        <div className="min-h-screen py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Design History</h1>
                    <p className="text-white/60">
                        View your past design transformations.
                    </p>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No history yet</h3>
                        <p className="text-white/60 mb-8">Start transforming your rooms to see them here.</p>
                        <Link
                            href="/upload"
                            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-medium transition-colors"
                        >
                            Create New Design
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {history.map((item) => (
                            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{item.styleName}</h3>
                                        <p className="text-white/60 text-sm">
                                            {new Date(item.date).toLocaleDateString()} • {item.imageCount} image{item.imageCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                                        Completed
                                    </span>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {item.images.map((img, idx) => (
                                        <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="Result" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
