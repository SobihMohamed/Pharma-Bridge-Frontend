import api from '@/lib/api';
import { PharmacyToCreateDto, PharmacyProfileDto } from '../types';
import { ApiResponse } from '@/types/api.types';

export const pharmacyProfileService = {
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

    const response = await api.post<ApiResponse<PharmacyProfileDto>>(
      '/api/pharmacy/register',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return (response as any).data;
  },
};
