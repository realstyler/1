"use client";

import { useAuthStore } from "@/auth/auth.store";
import { redirect } from "next/navigation";


import ProjectNavbar from "@/components/layout/ProjectNavbar";
import ProjectFooter from "@/components/layout/ProjectFooter";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const userState = useAuthStore((s) => s.user);

  if (userState === undefined) return;
  if (userState === null) redirect("/login");

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