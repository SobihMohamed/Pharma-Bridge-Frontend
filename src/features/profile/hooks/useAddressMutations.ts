import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addressService } from '../services/addressService';
import { CreatePatientAddressDto, UpdatePatientAddressDto } from '../types';
import { ApiError } from '@/types/api.types';

export const useCreateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientAddressDto) => addressService.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAddresses'] });
      toast.success('Address added successfully');
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to add address.');
      }
    }
  });
};

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { addressId: number; data: UpdatePatientAddressDto }) => 
      addressService.updateAddress(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAddresses'] });
      toast.success('Address updated successfully');
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to update address.');
      }
    }
  });
};

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => addressService.deleteAddress(addressId),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['patientAddresses'] });
      toast.success(message as unknown as string || 'Address deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete address.');
    }
  });
};

export const useSetDefaultAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => addressService.setDefaultAddress(addressId),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['patientAddresses'] });
      toast.success(message as unknown as string || 'Default address set successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to set default address.');
    }
  });
};
