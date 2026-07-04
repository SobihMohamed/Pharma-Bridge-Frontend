import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { NearbyRequestDto } from '../types';

export interface PharmacyRequestDetailsDto {
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

export const useGetPrescriptionRequestQuery = (requestId: number | undefined) => {
  return useQuery({
    queryKey: ['prescription-request', requestId],
    queryFn: async () => {
      const response = await api.get<NearbyRequestDto>(`/api/prescription-requests/${requestId}`);
      return response.data;
    },
    enabled: !!requestId,
  });
};

export const useGetPharmacyRequestDetailsQuery = (requestId: number | undefined) => {
  return useQuery({
    queryKey: ['pharmacy-prescription-request', requestId],
    queryFn: async () => {
      const response: any = await api.get(`/api/pharmacy-requests/for-pharmacy/${requestId}`);
      return response.data as PharmacyRequestDetailsDto;
    },
    enabled: !!requestId,
  });
};
