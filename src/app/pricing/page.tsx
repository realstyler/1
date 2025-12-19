import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-6">Pricing Plans</h1>
                <p className="text-white/60 mb-12">
                    Choose the perfect plan for your design needs.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Free */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                        <h3 className="text-xl font-semibold mb-2">Starter</h3>
                        <div className="text-3xl font-bold mb-4">Free</div>
                        <p className="text-white/60 text-sm mb-6">Perfect for trying out RealStyler.</p>
                        <ul className="text-left space-y-3 mb-8 flex-1">
                            <li className="text-sm">✓ 3 Designs per day</li>
                            <li className="text-sm">✓ Standard resolution</li>
                            <li className="text-sm">✓ Basic styles</li>
                        </ul>
                        <Link href="/upload" className="block w-full py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium">
                            Get Started
                        </Link>
                    </div>

                    {/* Pro */}
                    <div className="p-8 bg-gradient-to-b from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl flex flex-col relative transform scale-105">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1 rounded-full text-xs font-bold">MOST POPULAR</div>
                        <h3 className="text-xl font-semibold mb-2 text-violet-300">Pro</h3>
                        <div className="text-3xl font-bold mb-4">$29<span className="text-lg font-normal text-white/50">/mo</span></div>
                        <p className="text-white/60 text-sm mb-6">For home owners and enthusiasts.</p>
                        <ul className="text-left space-y-3 mb-8 flex-1">
                            <li className="text-sm">✓ Unlimited designs</li>
                            <li className="text-sm">✓ HD / 4K Export</li>
                            <li className="text-sm">✓ All premium styles</li>
                            <li className="text-sm">✓ Priority processing</li>
                        </ul>
                        <button className="block w-full py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-full transition-colors text-sm font-medium">
                            Go Pro
                        </button>
                    </div>

                    {/* Business */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                        <h3 className="text-xl font-semibold mb-2">Business</h3>
                        <div className="text-3xl font-bold mb-4">$99<span className="text-lg font-normal text-white/50">/mo</span></div>
                        <p className="text-white/60 text-sm mb-6">For real estate agents and stagers.</p>
                        <ul className="text-left space-y-3 mb-8 flex-1">
                            <li className="text-sm">✓ Team management</li>
                            <li className="text-sm">✓ API Access</li>
                            <li className="text-sm">✓ White-labeling</li>
                            <li className="text-sm">✓ Dedicated support</li>
                        </ul>
                        <button className="block w-full py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
