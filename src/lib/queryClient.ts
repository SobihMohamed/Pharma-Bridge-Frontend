import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/types/api.types';
import { useAuthStore } from '@/features/auth/store/authStore';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: unknown) => {
        const apiError = error as ApiError;
        if (apiError.statusCode === 401) {
          useAuthStore.getState().clearAuth();
          // The axios interceptor also redirects, but we clear it here as a global fallback
        }
      },
    },
  },
});
