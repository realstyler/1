import { create } from "zustand";
import { UserDTO } from "./auth.dto";

type State = {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
};

export const useAuthStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
