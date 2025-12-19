export default function BlogPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-12 text-center">Blog</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Article 1 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-white/5 rounded-2xl mb-4 overflow-hidden border border-white/10">
                            <div className="w-full h-full bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 group-hover:scale-105 transition-transform duration-500"></div>
                        </div>
                        <p className="text-sm text-violet-400 mb-2">Design Tips • Dec 19, 2024</p>
                        <h2 className="text-xl font-bold mb-2 group-hover:text-violet-300 transition-colors">Top 10 Interior Design Trends for 2025</h2>
                        <p className="text-white/60 text-sm line-clamp-2">Discover what's hot in the world of interior design next year. From sustainable materials to bold colors.</p>
                    </div>

                    {/* Article 2 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-white/5 rounded-2xl mb-4 overflow-hidden border border-white/10">
                            <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-cyan-900/40 group-hover:scale-105 transition-transform duration-500"></div>
                        </div>
                        <p className="text-sm text-cyan-400 mb-2">AI Technology • Dec 15, 2024</p>
                        <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">How AI is changing Home Staging</h2>
                        <p className="text-white/60 text-sm line-clamp-2">Virtual staging is becoming the standard for real estate agents. Learn how AI makes it faster and cheaper.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
