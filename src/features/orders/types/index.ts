export type OrderStatus = 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';

export interface OrderItemDto {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDto {
  id: string;
  requestId: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyPhone?: string;
  status: OrderStatus;
  items: OrderItemDto[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddressId: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  hasComplaint?: boolean;
  hasRating?: boolean;
}
