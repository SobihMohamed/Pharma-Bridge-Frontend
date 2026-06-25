import api from '@/lib/api';
import { PatientProfileDto, PatientProfileToUpdateDto, PatientQueryParams } from '../types';
import { ApiResponse, PaginationResponse } from '@/types/api.types';

export const profileService = {
  getMyProfile: async (): Promise<PatientProfileDto> => {
    const response = await api.get<ApiResponse<PatientProfileDto>>('/api/patient-profile');
    return (response as any).data;
  },

  updateMyProfile: async (data: PatientProfileToUpdateDto): Promise<PatientProfileDto> => {
    const response = await api.put<ApiResponse<PatientProfileDto>>('/api/patient-profile', data);
    return (response as any).data;
  },

  getAllPatients: async (params: PatientQueryParams): Promise<PaginationResponse<PatientProfileDto>> => {
    const response = await api.get<ApiResponse<PaginationResponse<PatientProfileDto>>>('/api/patient-profile/all', { params });
    return (response as any).data;
  }
};
