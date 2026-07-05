import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiError } from '@/types/api.types';

export interface PharmacyOwnerProfileDto {
  id: number;
  userId: string;
  name: string;
  status: string; // 'Pending', 'Approved', 'Rejected'
  // other fields omitted for brevity
}

export const useGetMyProfileQuery = () => {
  return useQuery({
    queryKey: ['myPharmacyProfile'],
    queryFn: async (): Promise<PharmacyOwnerProfileDto | null> => {
      try {
        const response = await api.get('/api/pharmacy-owners/me');
        return (response as any).data;
      } catch (error: any) {
        // Handle 404 as a valid business state (Missing Profile)
        if (error?.statusCode === 404 || error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    // Prevent React Query from aggressively retrying a missing profile
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 404 || error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};
