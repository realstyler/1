import Footer from '@/components/layout/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">

            <div className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">Terms of Service</h1>
                        <p className="text-neutral-500">Last updated: December 29, 2025</p>
                    </div>

                    <div className="space-y-12 text-neutral-600 leading-relaxed font-light">
                        <section>
                            <h2 className="text-2xl font-serif text-neutral-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using RealStyler, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-neutral-900 mb-4">2. Description of Service</h2>
                            <p>
                                RealStyler provides users with access to a rich collection of resources, including AI-driven interior design generation, style transfer, and architectural visualization tools. You understand and agree that the Service may include advertisements and that these advertisements are necessary for RealStyler to provide the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-neutral-900 mb-4">3. User Conduct</h2>
                            <p className="mb-4">
                                You agree to not use the Service to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Upload any content that is unlawful, harmful, threatening, abusive, harassing, or otherwise objectionable.</li>
                                <li>Impersonate any person or entity.</li>
                                <li>Forge headers or otherwise manipulate identifiers in order to disguise the origin of any content transmitted through the Service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-neutral-900 mb-4">4. Intellectual Property</h2>
                            <p>
                                The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
