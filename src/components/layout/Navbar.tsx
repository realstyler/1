'use client';

import Link from 'next/link';
import { logout } from '@/app/actions/auth';

interface NavbarProps {
    isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
    return (
        <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between relative">
                <Link href="/" className="font-serif text-xl italic z-10">
                    RealStyler.
                </Link>

                <div className="hidden md:flex items-center gap-12 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Link href="/#features" className="text-xs font-medium text-neutral-600 hover:text-black tracking-widest transition uppercase">
                        Product
                    </Link>
                    <Link href="/#portfolio" className="text-xs font-medium text-neutral-600 hover:text-black tracking-widest transition uppercase">
                        Showcase
                    </Link>
                    <Link href="/pricing" className="text-xs font-medium text-neutral-600 hover:text-black tracking-widest transition uppercase">
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-6 z-10">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium text-neutral-600 hover:text-black transition">
                                Dashboard
                            </Link>
                            <form action={logout}>
                                <button type="submit" className="bg-neutral-100 text-neutral-900 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-200 transition">
                                    Log out
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-black transition">
                                Log in
                            </Link>
                            <Link href="/upload" className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition">
                                Get started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
