"use client";

import { UserDTO } from "@/auth/auth.dto";
import { useAuthStore } from "@/auth/auth.store";
import { useEffect } from "react";

export default function InitUser({
  user,
  children,
}: {
  user: UserDTO;
  children: React.ReactNode;
}) {
  const stateUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);

  if (!stateUser) return;
  return children;
}
