import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginationResponse } from '@/types/api.types';
import { NearbyRequestDto } from '../types';

interface UseNearbyRequestsParams {
  Status?: string;
  RadiusInKm?: number;
  PageIndex?: number;
  PageSize?: number;
}

export const useNearbyRequestsQuery = (params: UseNearbyRequestsParams = {}) => {
  const { Status = 'Pending', RadiusInKm = 5, PageIndex = 1, PageSize = 10 } = params;

  return useQuery({
    queryKey: ['nearby-requests', Status, RadiusInKm, PageIndex, PageSize],
    queryFn: async () => {
      const response = await api.get<PaginationResponse<NearbyRequestDto>>('/api/pharmacy-requests/nearby', {
        params: { Status, RadiusInKm, PageIndex, PageSize }
      });
      return response.data!;
    },
  });
};
