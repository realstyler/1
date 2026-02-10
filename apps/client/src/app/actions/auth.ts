'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Simple validation (mock)
    if (!email || !password) {
        // return { error: 'Please fill in all fields' };
        return;
    }

    // Create session (mock)
    const session = {
        user: {
            email,
            name: email.split('@')[0], // Mock name from email
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Set cookie
    (await cookies()).set('session', JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    redirect('/dashboard');
}

export async function signup(formData: FormData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        // return { error: 'Please fill in all fields' };
        return;
    }

    // Create session
    const session = {
        user: {
            email,
            name,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    (await cookies()).set('session', JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    redirect('/dashboard');
}

export async function logout() {
    (await cookies()).delete('session');
    redirect('/login');
}
