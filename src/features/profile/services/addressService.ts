import api from '@/lib/api';
import { PatientAddressDto, CreatePatientAddressDto, UpdatePatientAddressDto } from '../types';
import { ApiResponse } from '@/types/api.types';

export const addressService = {
  getAddresses: async (): Promise<PatientAddressDto[]> => {
    const response = await api.get<ApiResponse<PatientAddressDto[]>>('/api/patient-addresses');
    return (response as any).data;
  },

  addAddress: async (data: CreatePatientAddressDto): Promise<PatientAddressDto> => {
    const response = await api.post<ApiResponse<PatientAddressDto>>('/api/patient-addresses', data);
    return (response as any).data;
  },

  updateAddress: async ({ addressId, data }: { addressId: number; data: UpdatePatientAddressDto }): Promise<PatientAddressDto> => {
    const response = await api.put<ApiResponse<PatientAddressDto>>(`/api/patient-addresses/${addressId}`, data);
    return (response as any).data;
  },

  deleteAddress: async (addressId: number): Promise<boolean> => {
    const response = await api.delete<ApiResponse<boolean>>(`/api/patient-addresses/${addressId}`);
    return (response as any).message; // Return message for toast
  },

  setDefaultAddress: async (addressId: number): Promise<boolean> => {
    const response = await api.put<ApiResponse<boolean>>(`/api/patient-addresses/${addressId}/set-default`);
    return (response as any).message; // Return message for toast
  }
};
