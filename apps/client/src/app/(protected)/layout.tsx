"use client";

import { useAuthStore } from "@/auth/auth.store";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userState = useAuthStore((s) => s.user);

  if (userState === undefined) return;
  if (userState === null) redirect("/login");

  return children;
}
