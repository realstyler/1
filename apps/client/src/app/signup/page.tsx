"use client";

import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { useRegister } from "@/auth/auth.hooks";
import { SubmitEvent } from "react";
import { redirect } from "next/navigation";
import { ApiError } from "shared";

export default function SignupPage() {
  const { mutateAsync, error } = useRegister();

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    await mutateAsync({ name, email, password });
    redirect("/dashboard");
  }

  const err = error instanceof ApiError && {
    message: error.message,
    code: error.code,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-2">
              Create an account
            </h1>
            <p className="text-neutral-500">
              Start your design journey with RealStyler
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-neutral-900 block"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-colors text-neutral-900 placeholder:text-neutral-400"
              />
              {err && err.code === "name" && (
                <p className="mt-1 text-red-500 text-sm">{err.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-900 block"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-colors text-neutral-900 placeholder:text-neutral-400"
              />
              {err && err.code === "email" && (
                <p className="mt-1 text-red-500 text-sm">{err.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-neutral-900 block"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-0 outline-none transition-colors text-neutral-900 placeholder:text-neutral-400"
              />

              {err && err.code === "password" ? (
                <p className="mt-1 text-red-500 text-sm">{err.message}</p>
              ) : (
                <p className="text-xs text-neutral-500">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-full font-medium hover:bg-neutral-800 transition shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 duration-300"
            >
              Create account
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-neutral-900 font-medium hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
