import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { prescriptionRequestService } from '../services/prescriptionRequestService';
import { ApiError } from '@/types/api.types';

export const useCreateRequestMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => prescriptionRequestService.createRequest(formData),
    onSuccess: () => {
      toast.success('Prescription request created successfully!');
      queryClient.invalidateQueries({ queryKey: ['patientRequests'] });
      navigate('/requests');
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to create request. Please try again.');
      }
    }
  });
};

export const useCancelRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => prescriptionRequestService.cancelRequest(id),
    onSuccess: (message, id) => {
      // Invalidate both lists and details to instantly refresh UI
      queryClient.invalidateQueries({ queryKey: ['patientRequests'] });
      queryClient.invalidateQueries({ queryKey: ['requestDetails', id] });
      toast.success(message || 'Prescription request cancelled successfully.');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to cancel request.');
    }
  });
};

export const useRespondToBidMutation = (options?: { onSuccess?: (data: any, variables: any) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bidId, status }: { bidId: number; status: 'Accepted' | 'Rejected'; requestId: number }) => 
      prescriptionRequestService.respondToBid({ bidId, status }),
    onSuccess: (data, variables) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update bid status.');
    }
  });
};
