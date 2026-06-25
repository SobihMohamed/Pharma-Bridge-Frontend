import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileService } from '../services/profileService';
import { PatientProfileToUpdateDto, PatientProfileDto } from '../types';
import { ApiError } from '@/types/api.types';

export const useUpdatePatientProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatientProfileToUpdateDto) => profileService.updateMyProfile(data),
    onSuccess: (updatedProfile) => {
      // Instantly update UI by setting query data with the returned updated profile
      queryClient.setQueryData(['patientProfile'], updatedProfile);
      toast.success('Profile updated successfully');
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to update profile.');
      }
    }
  });
};
