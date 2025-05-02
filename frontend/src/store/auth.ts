import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
