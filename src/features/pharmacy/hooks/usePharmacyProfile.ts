import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { pharmacyProfileService } from '../services/pharmacyProfileService';
import { PharmacyToCreateDto, PharmacyToUpdateDto, PharmacyProfileDto } from '../types';
import { ApiError } from '@/types/api.types';

export const useMyPharmacyProfileQuery = (enabled: boolean = true) => {
  return useQuery<PharmacyProfileDto | null, ApiError>({
    queryKey: ['myPharmacyProfile'],
    queryFn: async () => {
      try {
        return await pharmacyProfileService.getMyPharmacyProfile();
      } catch (error: any) {
        const apiError = error as ApiError;
        // Catch 404 from either our custom ApiError mapping or a raw Axios response
        if (apiError.statusCode === 404 || error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false, // Do not retry on 404
    throwOnError: false, // Prevent React Query from crashing the UI/triggering error boundaries
    enabled,
    refetchOnMount: 'always', // Ensures a network request is made every time the tab is clicked!
  });
};

export const useRegisterPharmacyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PharmacyToCreateDto) => pharmacyProfileService.registerPharmacy(data),
    onSuccess: () => {
      toast.success('Pharmacy registered successfully and is now under review.');
      queryClient.invalidateQueries({ queryKey: ['myPharmacyProfile'] });
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to register pharmacy. Please try again.');
      }
    }
  });
};

export const useUpdatePharmacyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PharmacyToUpdateDto) => pharmacyProfileService.updateMyPharmacyProfile(data),
    onSuccess: () => {
      toast.success('Pharmacy profile updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['myPharmacyProfile'] });
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to update pharmacy profile. Please try again.');
      }
    }
  });
};
