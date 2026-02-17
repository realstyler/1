import { loginApi } from "./auth.api";
import { useAuthStore } from "./auth.store";
import { LoginDTO } from "shared"

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return async (data: LoginDTO) => {
    const user = await loginApi(data);
    setUser(user);
    return user;
  };
}
