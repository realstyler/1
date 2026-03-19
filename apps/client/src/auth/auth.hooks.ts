"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { loginApi, logoutApi, meApi, registerApi } from "./auth.api";
import { useAuthStore } from "./auth.store";
import {
  ApiError,
  LoginDTO,
  LoginSchema,
  RegisterDTO,
  RegisterSchema,
  zodParseOrThrow,
} from "shared";
import { UserDTO } from "./auth.dto";
import { useEffect } from "react";

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<UserDTO, ApiError | Error, LoginDTO>({
    mutationFn: async (data) => {
      zodParseOrThrow(LoginSchema, data);
      return loginApi(data);
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<UserDTO, ApiError | Error, RegisterDTO>({
    mutationFn: async (data) => {
      zodParseOrThrow(RegisterSchema, data);
      return registerApi(data);
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });
}

export function useLogout() {
  const setUser = useAuthStore((s) => s.setUser);

  return async () => {
    await logoutApi();
    setUser(null);
    redirect("/");
  };
}

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: meApi,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isSuccess && data) setUser(data);
    else setUser(null);
  }, [data, isSuccess, setUser]);

  return {
    isLoading,
    user: data,
  };
}
