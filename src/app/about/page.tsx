export default function AboutPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-6">About RealStyler</h1>
                <p className="text-lg text-white/80 mb-8">
                    We are on a mission to democratize interior design.
                </p>

                <p className="text-white/60 mb-6 leading-relaxed">
                    RealStyler was born from the idea that everyone deserves a beautiful home.
                    Traditional interior design is expensive and time-consuming.
                    We leverage the power of Artificial Intelligence to give you instant access to
                    professional-grade design concepts for a fraction of the cost.
                </p>

                <p className="text-white/60 mb-12 leading-relaxed">
                    Our team consists of architects, AI researchers, and designers working together
                    to build the next generation of creative tools.
                </p>

                <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="text-3xl font-bold text-violet-400 mb-1">10k+</div>
                        <div className="text-sm text-white/40">Designs Generated</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="text-3xl font-bold text-fuchsia-400 mb-1">50+</div>
                        <div className="text-sm text-white/40">Countries Served</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="text-3xl font-bold text-blue-400 mb-1">24/7</div>
                        <div className="text-sm text-white/40">AI Availability</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
