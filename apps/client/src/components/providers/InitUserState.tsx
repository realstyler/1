"use client";

import { UserDTO } from "@/auth/auth.dto";
import { useAuthStore } from "@/auth/auth.store";
import { useEffect } from "react";

export default function InitUserState({
  user,
  children,
}: {
  user: UserDTO | null | undefined;
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);

  return children;
}
