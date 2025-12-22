import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">Pricing Plans</h1>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                        {/* Starter Feature */}
                        <div className="p-8 rounded-3xl bg-white border border-transparent">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-medium text-neutral-900 mb-2">Starter</h3>
                                <div className="text-4xl font-serif text-neutral-900 mb-4">Free</div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-neutral-600">
                                    <span className="text-neutral-900">✓</span> 3 Designs per day
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-600">
                                    <span className="text-neutral-900">✓</span> Standard resolution
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-600">
                                    <span className="text-neutral-900">✓</span> Basic styles
                                </li>
                            </ul>

                            <div className="text-center">
                                <Link href="/upload" className="text-sm font-medium text-neutral-900 hover:text-neutral-700 transition">
                                    Get Started
                                </Link>
                            </div>
                        </div>

                        {/* Pro Feature - Highlighted */}
                        <div className="p-8 rounded-3xl bg-[#F3E8FF] relative transform scale-105 shadow-xl">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D946EF] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                MOST POPULAR
                            </div>

                            <div className="text-center mb-8 pt-4">
                                <h3 className="text-xl font-medium text-[#9333EA] mb-2">Pro</h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-serif text-neutral-900">$29</span>
                                    <span className="text-neutral-500">/mo</span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-2">For home owners and enthusiasts.</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-neutral-700">
                                    <span className="text-[#9333EA]">✓</span> Unlimited designs
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-700">
                                    <span className="text-[#9333EA]">✓</span> HD / 4K Export
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-700">
                                    <span className="text-[#9333EA]">✓</span> All premium styles
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-700">
                                    <span className="text-[#9333EA]">✓</span> Priority processing
                                </li>
                            </ul>

                            <button className="w-full py-3 bg-gradient-to-r from-[#A855F7] to-[#D946EF] text-white rounded-full text-sm font-bold tracking-wide hover:shadow-lg transition-shadow">
                                Go Pro
                            </button>
                        </div>

                        {/* Business Feature */}
                        <div className="p-8 rounded-3xl bg-white border border-transparent">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-medium text-neutral-900 mb-2">Business</h3>
                                <div className="text-4xl font-serif text-neutral-900 mb-4">$99</div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-neutral-600">
                                    <span className="text-neutral-900">✓</span> Team management
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-600">
                                    <span className="text-neutral-900">✓</span> API Access
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-600">
                                    <span className="text-neutral-900">✓</span> White-labeling
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-600">
                                    <span className="text-neutral-900">✓</span> Dedicated support
                                </li>
                            </ul>

                            <div className="text-center">
                                <button className="text-sm font-medium text-neutral-900 hover:text-neutral-700 transition">
                                    Contact Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
