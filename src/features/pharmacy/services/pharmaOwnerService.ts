import api from '@/lib/api';
import {
  PharmaOwnerProfileDto,
  CreatePharmaOwnerProfileDto,
  UpdatePharmaOwnerProfileDto,
} from '../types/ownerProfile';

export const pharmaOwnerService = {
  getOwnerProfile: async (): Promise<PharmaOwnerProfileDto> => {
    const response = await api.get<PharmaOwnerProfileDto>('/api/pharma-owner-profile');
    return response.data!;
  },

  createOwnerProfile: async (data: CreatePharmaOwnerProfileDto): Promise<PharmaOwnerProfileDto> => {
    const formData = new FormData();
    formData.append('NationalId', data.nationalId);
    formData.append('NationalIdFront', data.nationalIdFront);
    formData.append('NationalIdBack', data.nationalIdBack);
    formData.append('SyndicateCardImage', data.syndicateCardImage);

    const response = await api.post<PharmaOwnerProfileDto>(
      '/api/pharma-owner-profile',
      formData,
      { headers: { 'Content-Type': undefined } }
    );
    return response.data!;
  },

  updateOwnerProfile: async (data: UpdatePharmaOwnerProfileDto): Promise<PharmaOwnerProfileDto> => {
    const formData = new FormData();
    formData.append('FullName', data.fullName);
    formData.append('PhoneNumber', data.phoneNumber);
    formData.append('NationalId', data.nationalId);

    if (data.nationalIdFront) {
      formData.append('NationalIdFront', data.nationalIdFront);
    }
    if (data.nationalIdBack) {
      formData.append('NationalIdBack', data.nationalIdBack);
    }
    if (data.syndicateCardImage) {
      formData.append('SyndicateCardImage', data.syndicateCardImage);
    }

    const response = await api.put<PharmaOwnerProfileDto>(
      '/api/pharma-owner-profile',
      formData,
      { headers: { 'Content-Type': undefined } }
    );
    return response.data!;
  },
};
