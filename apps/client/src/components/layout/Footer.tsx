import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-neutral-100">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between mb-20 gap-8">
                    {/* Brand */}
                    <div className="md:w-1/3 lg:max-w-md">
                        <Link href="/" className="font-serif text-2xl italic font-semibold tracking-tight mb-4 block text-neutral-900">
                            RealStyler.
                        </Link>
                        <p className="text-neutral-500 text-sm font-light leading-relaxed">
                            The new standard for AI-assisted interior design <br /> and property staging. San Francisco, CA.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16 md:w-1/2 justify-end md:ml-auto">
                        {/* Platform Links */}
                        <div>
                            <h4 className="text-[10px] font-semibold text-neutral-900 uppercase tracking-widest mb-6">Platform</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'Features', href: '/features' },
                                    { name: 'Pricing', href: '/pricing' },
                                    { name: 'Enterprise', href: '#' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-neutral-500 hover:text-neutral-900 text-sm transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="text-[10px] font-semibold text-neutral-900 uppercase tracking-widest mb-6">Company</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'About', href: '/about' },
                                    { name: 'Blog', href: '/blog' },
                                    { name: 'Careers', href: '/careers' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-neutral-500 hover:text-neutral-900 text-sm transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h4 className="text-[10px] font-semibold text-neutral-900 uppercase tracking-widest mb-6">Legal</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'Privacy', href: '/privacy' },
                                    { name: 'Terms', href: '/terms' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-neutral-500 hover:text-neutral-900 text-sm transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-neutral-400 text-xs leading-none">
                        © 2024 RealStyler Inc.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-neutral-400 hover:text-neutral-900 transition-colors duration-300 flex items-center">
                            <Twitter className="w-5 h-5" strokeWidth={2} />
                        </Link>
                        <Link href="#" className="text-neutral-400 hover:text-neutral-900 transition-colors duration-300 flex items-center">
                            <Instagram className="w-5 h-5" strokeWidth={2} />
                        </Link>
                        <Link href="#" className="text-neutral-400 hover:text-neutral-900 transition-colors duration-300 flex items-center">
                            <Linkedin className="w-5 h-5" strokeWidth={2} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}