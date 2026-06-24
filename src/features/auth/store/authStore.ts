import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthModelDto, UserRole } from '@/types/auth.types';

interface AuthState {
  token: string | null;
  user: { name: string; email: string; roles: string[] } | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthModelDto) => void;
  clearAuth: () => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: 'mock-token',
      user: { name: 'Test Pharmacy', email: 'test@pharmacy.com', roles: ['PharmacyOwner'] },
      isAuthenticated: true,

      setAuth: (data: AuthModelDto) => {
        set({
          token: data.token,
          user: {
            name: data.name,
            email: data.email,
            roles: data.roles,
          },
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.roles.includes(role) ?? false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
