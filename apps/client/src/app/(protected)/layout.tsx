"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/auth/auth.store";
import { useRouter } from "next/navigation";
import ProjectNavbar from "@/components/layout/ProjectNavbar";
import ProjectFooter from "@/components/layout/ProjectFooter";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const userState = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (userState === null) {
      router.replace("/");
    }
  }, [userState, router]);

  if (!userState) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f7]">
      <ProjectNavbar />
      <main className="flex-1">
        {children}
      </main>
      <ProjectFooter />
    </div>
  );
}