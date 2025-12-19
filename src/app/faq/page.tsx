export default function FAQPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
                <p className="text-white/60 mb-12 text-center">
                    Everything you need to know about RealStyler.
                </p>

                <div className="space-y-6">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-2">How does it work?</h3>
                        <p className="text-white/60">We use advanced AI models to analyze the structure of your room and apply new design styles while maintaining the original layout.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-2">Is it free to use?</h3>
                        <p className="text-white/60">Yes, we offer a free tier that allows you to generate a limited number of designs per day. For unlimited access and higher quality, check our Pro plan.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-2">Can I upload any image?</h3>
                        <p className="text-white/60">Yes, as long as it is a JPG, PNG, or WebP file. For best results, use well-lit photos of empty or furnished rooms.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
                        <p className="text-white/60">If you are not satisfied with our Pro plan, please contact support within 14 days for a full refund.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
