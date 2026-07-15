import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginationResponse } from '@/types/api.types';

export interface OrderSummaryDto {
  id: number;
  amount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  pharmacyId: number;
  pharmacyName: string;
  patientName: string;
}

export interface OrderItemDto {
  itemName: string;
  unitPrice: number;
  quantity: number;
  isAlternative: boolean;
  alternativeNote?: string;
  lineTotal: number;
}

export interface OrderDetailsDto {
  id: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  amount: number;
  orderStatus: string;
  cancelReason?: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  cancelledAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  deliveryAddress: string;
  pharmacyId: number;
  pharmacyName: string;
  pharmacyPhone: string;
  patientName: string;
  patientPhone: string;
  bidId: number;
  prescriptionRequestId: number;
  pharmacyRating?: {
    ratingValue: number;
    comment: string;
  };
  items: OrderItemDto[];
}

export interface OrderQueryParams {
  Status?: string;
  FromDate?: string;
  ToDate?: string;
  Search?: string;
  PharmacyId?: number;
  PatientId?: string;
  PageIndex?: number;
  PageSize?: number;
}

export type PaginatedOrdersResponse = PaginationResponse<OrderSummaryDto>;

export const ordersApi = {
  createOrderFromBid: async (bidId: number): Promise<OrderSummaryDto> => {
    const response = await api.post(`/api/orders/create-from-bid/${bidId}`);
    return (response as any).data;
  },

  getMyOrders: async (params: OrderQueryParams): Promise<PaginatedOrdersResponse> => {
    const response = await api.get('/api/orders/my', { params });
    return (response as any).data;
  },

  getOrderDetails: async (orderId: number): Promise<OrderDetailsDto> => {
    const response = await api.get(`/api/orders/my/${orderId}`);
    return (response as any).data;
  }
};

export const useCreateOrderFromBidMutation = () => {
  return useMutation({
    mutationFn: (bidId: number) => ordersApi.createOrderFromBid(bidId),
  });
};

export interface RatingPayload {
  ratingValue: number;
  comment: string;
  pharmacyId: number;
  orderId: number;
}

export const useSubmitPharmacyRatingMutation = () => {
  return useMutation({
    mutationFn: async (payload: RatingPayload) => {
      const response = await api.post('/api/pharmacy-rating/submit', payload);
      return response;
    }
  });
};

export const useGetMyOrdersQuery = (params: OrderQueryParams) => {
  return useQuery({
    queryKey: ['myOrders', params],
    queryFn: () => ordersApi.getMyOrders(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetOrderDetailsQuery = (orderId: number) => {
  return useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: () => ordersApi.getOrderDetails(orderId),
    enabled: !!orderId,
  });
};
