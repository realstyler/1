import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-white">

            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
                <div className="max-w-xl mx-auto text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-serif text-neutral-900 mb-4">Settings</h1>
                    <p className="text-neutral-500 text-lg mb-8 font-light">
                        We are currently building advanced configuration options. Check back soon for account management, billing, and API keys.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-neutral-900 hover:text-neutral-600 transition"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Return to Dashboard
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
