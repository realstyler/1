'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa]/80 backdrop-blur-md border-b border-zinc-200/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 z-10">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-serif italic font-medium tracking-tight text-zinc-900">RealStyler.</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                        {['Product', 'Showcase', 'Pricing'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Showcase' ? '/#showcase' : `/${item.toLowerCase()}`}
                                className="text-xs font-medium tracking-wide uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center gap-6 z-10">
                        <Link href="/login" className="hidden md:block text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                            Log in
                        </Link>
                        <Link
                            href="/upload"
                            className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
