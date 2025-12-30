import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Footer from '@/components/layout/Footer';

async function getSession() {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie?.value) return null;
    try {
        return JSON.parse(sessionCookie.value);
    } catch {
        return null;
    }
}

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-white">

            <div className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 md:p-12">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-serif">
                                {session.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-serif text-neutral-900 mb-1">
                                    Welcome, {session.user.name}
                                </h1>
                                <p className="text-neutral-500">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">My Designs</h3>
                                <p className="text-neutral-500 text-sm">View and manage your generated transformations.</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">Credits</h3>
                                <p className="text-neutral-500 text-sm">You have 3 free generations remaining.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
