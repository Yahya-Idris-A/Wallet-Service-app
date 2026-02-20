import { create } from 'zustand';

interface User {
  customer_name: string;
  balance: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;
  setUser: (user: User) => void;
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  setInitialized: (status: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isInitialized: false, // Menandakan apakah silent refresh awal sudah selesai
  
  setUser: (user) => set({ user }),
  setAuth: (user, token) => set({ user, accessToken: token, isInitialized: true }),
  setAccessToken: (token) => set({ accessToken: token }),
  setInitialized: (status) => set({ isInitialized: status }),
  clearAuth: () => set({ user: null, accessToken: null, isInitialized: true }),
}));