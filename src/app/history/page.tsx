'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

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
        <div className="min-h-screen bg-white">

            <div className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">
                            Design History
                        </h1>
                        <p className="text-neutral-500 max-w-xl mx-auto text-lg font-light">
                            View your past design transformations.
                        </p>
                    </div>

                    {history.length === 0 ? (
                        <div className="text-center py-24 bg-neutral-50 rounded-3xl border border-neutral-100 max-w-2xl mx-auto">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-neutral-900 mb-2">No history yet</h3>
                            <p className="text-neutral-500 mb-8">Start transforming your rooms to see them here.</p>
                            <Link
                                href="/upload"
                                className="inline-block px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                            >
                                Create New Design
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {history.map((item) => (
                                <div key={item.id} className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-serif font-medium text-neutral-900 mb-1">{item.styleName}</h3>
                                            <p className="text-neutral-500 text-sm">
                                                {new Date(item.date).toLocaleDateString()} • {item.imageCount} image{item.imageCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <span className="px-4 py-1.5 bg-neutral-100 text-neutral-600 text-xs font-bold tracking-wider uppercase rounded-full">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {item.images.map((img, idx) => (
                                            <div key={idx} className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200">
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

            <Footer />
        </div>
    );
}
