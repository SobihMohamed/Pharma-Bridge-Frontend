import api from '@/lib/api';
import { PharmacyToCreateDto, PharmacyProfileDto, PharmacyToUpdateDto } from '../types';
import { ApiResponse } from '@/types/api.types';

export const pharmacyProfileService = {
  getMyPharmacyProfile: async (): Promise<PharmacyProfileDto> => {
    const response = await api.get<PharmacyProfileDto>('/api/pharmacy/my-profile');
    return response.data!;
  },

  registerPharmacy: async (data: PharmacyToCreateDto): Promise<PharmacyProfileDto> => {
    const formData = new FormData();
    formData.append('PharmacyName', data.PharmacyName);
    formData.append('LicenseNumber', data.LicenseNumber);
    
    if (data.LicenseImage) {
      formData.append('LicenseImage', data.LicenseImage);
    }
    
    formData.append('Latitude', data.Latitude.toString());
    formData.append('Longitude', data.Longitude.toString());
    formData.append('OpenTime', data.OpenTime);
    formData.append('CloseTime', data.CloseTime);
    formData.append('Is24Hours', data.Is24Hours.toString());
    formData.append('TextAddress', data.TextAddress);
    formData.append('Area', data.Area);
    formData.append('ContactPhone', data.ContactPhone);

    const response = await api.post<PharmacyProfileDto>(
      '/api/pharmacy/register',
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    );
    
    return response.data!;
  },

  updateMyPharmacyProfile: async (data: PharmacyToUpdateDto): Promise<PharmacyProfileDto> => {
    const formData = new FormData();

    if (data.PharmacyName !== undefined) formData.append('PharmacyName', data.PharmacyName);
    if (data.LicenseNumber !== undefined) formData.append('LicenseNumber', data.LicenseNumber);
    if (data.Latitude !== undefined) formData.append('Latitude', data.Latitude.toString());
    if (data.Longitude !== undefined) formData.append('Longitude', data.Longitude.toString());
    if (data.OpenTime !== undefined) formData.append('OpenTime', data.OpenTime);
    if (data.CloseTime !== undefined) formData.append('CloseTime', data.CloseTime);
    if (data.Is24Hours !== undefined) formData.append('Is24Hours', data.Is24Hours.toString());
    if (data.TextAddress !== undefined) formData.append('TextAddress', data.TextAddress);
    if (data.Area !== undefined) formData.append('Area', data.Area);
    if (data.ContactPhone !== undefined) formData.append('ContactPhone', data.ContactPhone);
    if (data.LicenseImage) formData.append('LicenseImage', data.LicenseImage);

    const response = await api.patch<PharmacyProfileDto>(
      '/api/pharmacy/my-profile',
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    );
    
    return response.data!;
  },
};
