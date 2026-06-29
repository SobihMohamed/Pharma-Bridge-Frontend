import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { pharmaOwnerService } from '../services/pharmaOwnerService';
import { CreatePharmaOwnerProfileDto, UpdatePharmaOwnerProfileDto, PharmaOwnerProfileDto } from '../types/ownerProfile';
import { ApiError } from '@/types/api.types';

export const usePharmaOwnerProfileQuery = () => {
  return useQuery<PharmaOwnerProfileDto | null, ApiError>({
    queryKey: ['pharmaOwnerProfile'],
    queryFn: async () => {
      try {
        return await pharmaOwnerService.getOwnerProfile();
      } catch (error) {
        const apiError = error as ApiError;
        // Gracefully handle 404 — profile not created yet
        if (apiError.statusCode === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (error.statusCode === 404) return false;
      return failureCount < 2;
    },
  });
};

export const useCreateOwnerProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePharmaOwnerProfileDto) => pharmaOwnerService.createOwnerProfile(data),
    onSuccess: () => {
      toast.success('Profile submitted successfully! It is now under review.');
      queryClient.invalidateQueries({ queryKey: ['pharmaOwnerProfile'] });
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach((err) => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to create profile. Please try again.');
      }
    },
  });
};

export const useUpdateOwnerProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePharmaOwnerProfileDto) => pharmaOwnerService.updateOwnerProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['pharmaOwnerProfile'] });
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach((err) => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to update profile. Please try again.');
      }
    },
  });
};
