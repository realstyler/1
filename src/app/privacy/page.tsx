import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">

            <div className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">Privacy Policy</h1>
                        <p className="text-neutral-500">Last updated: December 29, 2025</p>
                    </div>

                    <div className="space-y-12 text-neutral-600 leading-relaxed font-light">
                        <section>
                            <h2 className="text-2xl font-serif text-neutral-900 mb-4">1. Information Collection</h2>
                            <p>
                                We collect information from you when you register on our site, subscribe to our newsletter, respond to a survey or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, phone number or credit card information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-neutral-900 mb-4">2. Use of Information</h2>
                            <p className="mb-4">
                                Any of the information we collect from you may be used in one of the following ways:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To personalize your experience (your information helps us to better respond to your individual needs).</li>
                                <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you).</li>
                                <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-neutral-900 mb-4">3. Data Protection</h2>
                            <p>
                                We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-neutral-900 mb-4">4. Third Parties</h2>
                            <p>
                                We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
