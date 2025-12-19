'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all duration-300">
                            RealStyler
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {[
                            { href: '/', label: 'Dashboard' },
                            { href: '/create', label: 'Create Design' },
                            { href: '/history', label: 'History' },
                            { href: '/settings', label: 'Settings', disabled: true },
                        ].map(({ href, label, disabled }) => (
                            <div key={href}>
                                {disabled ? (
                                    <span className="text-sm font-medium text-white/30 cursor-not-allowed">
                                        {label}
                                    </span>
                                ) : (
                                    <Link
                                        href={href}
                                        className={`text-sm font-medium transition-colors duration-200 ${pathname === href
                                            ? 'text-white'
                                            : 'text-white/60 hover:text-white'
                                            }`}
                                    >
                                        {label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <Link
                        href="/upload"
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-violet-500/25"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
