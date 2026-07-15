import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { OrderSummaryDto, OrderQueryParams, PaginatedOrdersResponse } from '@/features/orders/api/orders';

export interface PharmacyOrderItemDto {
  itemName: string;
  unitPrice: number;
  quantity: number;
  isAlternative: boolean;
  alternativeNote?: string;
  lineTotal: number;
}

export interface PharmacyOrderDetailsDto {
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
  deliveryAddress: string;
  patientName: string;
  patientPhone: string;
  pharmacyRating?: {
    ratingValue: number;
    comment: string;
  } | null;
  items: PharmacyOrderItemDto[];
}

export const pharmacyOrdersApi = {
  getPharmacyOrders: async (params: OrderQueryParams): Promise<PaginatedOrdersResponse> => {
    // Pharmacy uses the base /api/orders endpoint for their dashboard
    const response = await api.get('/api/orders', { params });
    return (response as any).data;
  },
  
  getPharmacyOrderDetails: async (orderId: number): Promise<PharmacyOrderDetailsDto> => {
    const response = await api.get(`/api/orders/${orderId}`);
    return (response as any).data;
  },

  updateOrderStatus: async (orderId: number, data: { orderStatus: string; cancelReason?: string }): Promise<boolean> => {
    const response = await api.patch(`/api/orders/${orderId}/status`, data);
    return (response as any).isSuccess;
  }
};

export const useGetPharmacyOrdersQuery = (params: OrderQueryParams) => {
  return useQuery({
    queryKey: ['pharmacyOrders', params],
    queryFn: () => pharmacyOrdersApi.getPharmacyOrders(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetPharmacyOrderDetailsQuery = (orderId: number) => {
  return useQuery({
    queryKey: ['pharmacyOrderDetails', orderId],
    queryFn: () => pharmacyOrdersApi.getPharmacyOrderDetails(orderId),
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatusMutation = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { orderStatus: string; cancelReason?: string }) => 
      pharmacyOrdersApi.updateOrderStatus(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pharmacyOrderDetails', orderId] });
      queryClient.invalidateQueries({ queryKey: ['pharmacyOrders'] });
      
      const statusMsg = variables.orderStatus === 'Cancelled' ? 'cancelled' : `updated to ${variables.orderStatus}`;
      toast.success(`Order successfully ${statusMsg}.`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update order status.');
    }
  });
};
