import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface SubmitComplaintPayload {
  title: string;
  description: string;
  orderId: number;
}

export interface ComplaintResponseDto {
  id: number;
  title: string;
  description: string;
  status: string;
  orderId: number;
  createdAt: string;
  resolvedAt?: string;
  submittedByName?: string;
  adminNotes?: string;
  resolvedByName?: string;
}

export const useSubmitComplaintMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitComplaintPayload): Promise<ComplaintResponseDto> => {
      const response = await api.post('/api/complaints/submit', payload);
      return (response as any).data;
    },
    onSuccess: () => {
      toast.success('Your complaint has been submitted successfully. Our team will review it shortly.');
      queryClient.invalidateQueries({ queryKey: ['patientComplaints'] });
    },
    onError: () => {
      toast.error('Failed to submit complaint. Please try again.');
    },
  });
};

export interface PaginatedComplaintsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: ComplaintResponseDto[];
}

export const useGetMyComplaintsQuery = (pageIndex: number, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['myComplaints', pageIndex, pageSize],
    queryFn: async (): Promise<PaginatedComplaintsResponse> => {
      const response = await api.get('/api/complaints/my-complaints', {
        params: { pageIndex, pageSize },
      });
      return (response as any).data;
    },
  });
};

export const useGetComplaintByIdQuery = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ['complaintDetails', id],
    queryFn: async (): Promise<ComplaintResponseDto> => {
      const response = await api.get(`/api/complaints/${id}`);
      return (response as any).data;
    },
    enabled: !!id,
  });
};
