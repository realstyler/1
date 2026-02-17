import api from "@/lib/axios";
import { fetcher } from "@/lib/fetcher";
import { UserDTO } from "./auth.dto";
import { LoginDTO, RegisterDTO } from "shared";

export const loginApi = async (data: LoginDTO) =>
  fetcher<UserDTO>(api.post("/api/auth/login", data));

export const registerApi = async (data: RegisterDTO) =>
  fetcher<UserDTO>(api.post("/api/auth/register", data));

export const logoutApi = async () => fetcher(api.post("/api/auth/logout"));

export const meApi = async () => fetcher<UserDTO>(api.get("/api/auth/me"));
