import { create } from "zustand";
import { UserDTO } from "./auth.dto";

type State = {
  user: UserDTO | null | undefined;
  setUser: (user: UserDTO | null | undefined) => void;
};

export const useAuthStore = create<State>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
