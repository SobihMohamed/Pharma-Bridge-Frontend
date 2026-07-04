import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { PaginationResponse } from '@/types/api.types';

export interface BidItemDto {
  id?: number;
  itemName: string;
  unitPrice: number;
  quantity: number;
  isAlternative: boolean;
  alternativeNote?: string | null;
  lineTotal?: number;
}

export interface CreateBidDto {
  prescriptionRequestId: number;
  pharmacyId: number;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  notes?: string | null;
  deliveryTimeInMinutes: number;
  bidItems: BidItemDto[];
}

export interface BidDto {
  id: number;
  pharmacyId: number;
  pharmacyName?: string;
  prescriptionRequestId: number;
  orderId?: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  totalPrice: number;
  notes?: string;
  deliveryTimeInMinutes: number;
  submittedAt: string;
  respondedAt?: string;
  bidItems: BidItemDto[];
}

export interface GetBidsParams {
  Status?: string;
  Search?: string;
  FromDate?: string;
  ToDate?: string;
  PageIndex?: number;
  PageSize?: number;
}

export const bidService = {
  createBid: async (pharmacyId: number, data: CreateBidDto) => {
    const response = await api.post(`/api/bids/pharmacy/${pharmacyId}`, data);
    return response.data;
  },
  
  getPharmacyBids: async (pharmacyId: number, params: GetBidsParams) => {
    const response: any = await api.get(`/api/bids/pharmacy/${pharmacyId}`, { params });
    // The interceptor unwraps AxiosResponse -> ApiResponse. 
    // We return response.data which is the PaginatedList object.
    return response.data;
  },

  getBidDetails: async (bidId: number) => {
    const response: any = await api.get(`/api/bids/${bidId}`);
    return response.data; // response is ApiResponse, response.data is the BidDto
  }
};

export const useCreateBidMutation = (pharmacyId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBidDto) => bidService.createBid(pharmacyId, data),
    onSuccess: () => {
      toast.success('Bid submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['pharmacy-bids'] });
      // Also invalidate nearby requests to show it was bid on if they reload
      queryClient.invalidateQueries({ queryKey: ['nearby-requests'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit bid. Please try again.');
    }
  });
};

export const useGetPharmacyBidsQuery = (pharmacyId: number | undefined, params: GetBidsParams) => {
  return useQuery({
    queryKey: ['pharmacy-bids', pharmacyId, params],
    queryFn: () => bidService.getPharmacyBids(pharmacyId!, params),
    enabled: !!pharmacyId, // Only fetch if we have a valid pharmacyId
  });
};

export const useGetBidDetailsQuery = (bidId: number | undefined) => {
  return useQuery({
    queryKey: ['bid-details', bidId],
    queryFn: () => bidService.getBidDetails(bidId!),
    enabled: !!bidId,
  });
};

export interface UpdateBidItemDto {
  id: number;
  itemName: string;
  unitPrice: number;
  quantity: number;
  isAlternative: boolean;
  alternativeNote?: string | null;
}

export interface UpdateBidDto {
  id: number;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  deliveryTimeInMinutes: number;
  notes?: string | null;
  bidItems: UpdateBidItemDto[];
}

export const bidServiceEnhanced = {
  ...bidService,
  updateBid: async (pharmacyId: number, data: UpdateBidDto) => {
    const response = await api.put(`/api/bids/pharmacy/${pharmacyId}`, data);
    return response.data;
  }
};

export const useUpdateBidMutation = (pharmacyId: number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBidDto) => bidServiceEnhanced.updateBid(pharmacyId!, data),
    onSuccess: (_, variables) => {
      toast.success('Bid updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['pharmacy-bids'] });
      queryClient.invalidateQueries({ queryKey: ['bid-details', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update bid. Please try again.');
    }
  });
};
