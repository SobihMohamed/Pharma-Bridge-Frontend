import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface LatestRequestDto {
  id: number;
  medicineName: string;
  status: string;
  patientNotes: string;
  imageUrl: string;
  expiresAt: string;
  createdAt: string;
  bidsCount: number;
  deliveryArea: string;
}

export interface ActiveOrderDto {
  id: number;
  amount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  pharmacyId: number;
  pharmacyName: string;
  patientName: string;
}

export interface PatientHomeData {
  latestRequests: LatestRequestDto[];
  recentOrders: ActiveOrderDto[];
}

export interface PatientHomeParams {
  requestsCount?: number;
  ordersCount?: number;
}

export const useGetPatientHomeQuery = (params: PatientHomeParams = { requestsCount: 3, ordersCount: 3 }) => {
  return useQuery<PatientHomeData>({
    queryKey: ['patientHome', params],
    queryFn: async () => {
      const response = await api.get('/api/patient/home', { params });
      return (response as any).data?.data ?? (response as any).data;
    },
  });
};
