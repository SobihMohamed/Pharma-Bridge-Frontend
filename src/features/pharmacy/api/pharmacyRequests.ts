import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface NearbyRequestDto {
  id: number;
  medicineName: string;
  status: string;
  patientNotes: string;
  imageUrl: string | null;
  expiresAt: string;
  createdAt: string;
  bidsCount: number;
  deliveryArea: string;
}

export interface PaginatedNearbyRequestsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: NearbyRequestDto[];
}

export interface GetNearbyRequestsParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
  status?: string;
  radiusInKm?: number;
  patientId?: number;
  fromDate?: string;
  toDate?: string;
}

export const useGetNearbyRequestsQuery = (params: GetNearbyRequestsParams) => {
  return useQuery({
    queryKey: ['nearbyRequests', params],
    queryFn: async (): Promise<PaginatedNearbyRequestsResponse> => {
      const queryParams = {
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
        Search: params.search,
        Status: params.status,
        RadiusInKm: params.radiusInKm,
        PatientId: params.patientId,
        FromDate: params.fromDate,
        ToDate: params.toDate,
      };
      const response = await api.get('/api/pharmacy-requests/nearby', { params: queryParams });
      return (response as any).data;
    },
  });
};

export const useGetRequestDetailsForPharmacyQuery = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ['pharmacyRequestDetails', id],
    queryFn: async (): Promise<NearbyRequestDto> => {
      const response = await api.get(`/api/pharmacy-requests/for-pharmacy/${id}`);
      return (response as any).data;
    },
    enabled: !!id,
  });
};
