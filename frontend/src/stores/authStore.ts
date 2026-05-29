import { create } from "zustand";
import { getToken, removeToken, setToken } from "../libs/auth";
import { apiFetch } from "../libs/api";

type LoginResponse = {
  access_token: string;
}

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
  login: (password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  syncFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getToken(),
  loading: false,
  error: "",
  syncFromStorage: () => {
    set({ isAuthenticated: !!getToken() })
  },
  clearError: () => set({ error: "" }),
  login: async (password) => {
    set({ loading: true, error: '' });
    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      setToken(data.access_token);
      set({ isAuthenticated: true, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인 실패';
      set({ loading: false, error: message });
      throw err;
    }
  },
  logout: () => {
    removeToken();
    set({ isAuthenticated: false, error: '' });
  },
}));