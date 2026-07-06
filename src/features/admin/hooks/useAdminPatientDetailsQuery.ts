import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface PatientAddressDto {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface AdminPatientProfileDto {
  id: string | number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  addresses: PatientAddressDto[];
  totalPrescriptionRequests: number;
  ordersCount: number;
  complaintsSubmitted: number;
  totalPharmacyRatings: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export const useGetPatientProfileByUserIdQuery = (applicationUserId: string | undefined) => {
  return useQuery<AdminPatientProfileDto>({
    queryKey: ['adminPatientDetails', applicationUserId],
    queryFn: async () => {
      const response = await api.get(`/api/patient-profile/user/${applicationUserId}`);
      // Safely handle API envelopes if they exist, else return direct data
      return (response as any).data?.data ?? (response as any).data;
    },
    enabled: !!applicationUserId,
  });
};
