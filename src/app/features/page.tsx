export default function FeaturesPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-6">Features</h1>
                <p className="text-white/60 mb-12">
                    Discover the power of AI-driven interior design with RealStyler.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-2">Smart Style Transfer</h3>
                        <p className="text-white/60">Upload your room and instantly see it transformed into any style you choose.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-2">Multi-Room Processing</h3>
                        <p className="text-white/60">Upload up to 5 images at once and process your entire home in one go.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-2">High-Res Export</h3>
                        <p className="text-white/60">Download crystal clear images perfect for presentations or contractors.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-2">Style History</h3>
                        <p className="text-white/60">Keep track of all your designs and revisit them anytime.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
