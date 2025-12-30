import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white py-20 border-t border-neutral-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="font-serif text-2xl italic tracking-tight mb-6 block">
                            RealStyler.
                        </Link>
                        <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                            The new standard for AI-assisted interior design and property staging. San Francisco, CA.
                        </p>
                    </div>

                    {/* Spacer column to push links to the right if needed, or just standard grid layout */}
                    {/* Based on screenshot, there seems to be space. Let's stick to standard grid but maybe adjust col spans if logo needs more space. 
                        Screenshot shows links aligned to right side possibly? Or spread. 
                        Let's do 1 column for brand, 3 columns for links. */}

                    {/* Platform Links */}
                    <div>
                        <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-6">Platform</h4>
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
                        <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-6">Company</h4>
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
                        <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-6">Legal</h4>
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

                <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-neutral-400 text-sm">
                        © 2024 RealStyler Inc.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:bg-black hover:text-white hover:border-transparent transition-all duration-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </Link>
                        <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:bg-black hover:text-white hover:border-transparent transition-all duration-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.632 2.465C6.268 2.218 6.994 2.049 8.058 2c1.024-.047 1.379-.06 3.808-.06zm0 1.562c-2.607 0-2.917.01-3.953.058-.934.042-1.442.196-1.778.33-.448.175-.768.384-1.104.72-.336.336-.545.656-.72 1.104-.134.336-.288.844-.33 1.778-.047 1.036-.058 1.346-.058 3.953v.47c0 2.606.01 2.917.058 3.953.042.934.196 1.442.33 1.778.175.448.384.768.72 1.104.336.336.656.545 1.104.72.336.134.844.288 1.778.33-1.036-.047-1.346-.058-3.953-.058h-.47zm0 3.822a5.952 5.952 0 110 11.904 5.952 5.952 0 010-11.904zm0 1.562a4.39 4.39 0 100 8.78 4.39 4.39 0 000-8.78zm7.345-5.32c0 .484-.393.877-.878.877a.877.877 0 110-1.754c.485 0 .878.393.878.877z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:bg-black hover:text-white hover:border-transparent transition-all duration-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
