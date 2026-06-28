import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { pharmacyProfileService } from '../services/pharmacyProfileService';
import { PharmacyToCreateDto } from '../types';
import { ApiError } from '@/types/api.types';

export const useRegisterPharmacyMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: PharmacyToCreateDto) => pharmacyProfileService.registerPharmacy(data),
    onSuccess: () => {
      toast.success('Pharmacy registered and under review');
      navigate('/pharmacy/dashboard');
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
