import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { UserDTO } from "./auth.dto";
import { LoginDTO, RegisterDTO } from "shared";

export const loginApi = async (data: LoginDTO) =>
  fetcher<UserDTO>(api.post("/api/auth/login", data));

export const registerApi = async (data: RegisterDTO) =>
  fetcher<UserDTO>(api.post("/api/auth/register", data));

export const logoutApi = async () =>
  fetcher<null>(api.post("/api/auth/logout"));

export const meApi = async () => {
  const response = await api.get("/api/auth/me", {
    ignore401: true,
  } as any);
  
  return response.data;
};
