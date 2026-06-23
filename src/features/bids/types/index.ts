export interface BidItemDto {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface BidDto {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  rating: number;
  totalPrice: number;
  deliveryTime: string;
  items: BidItemDto[];
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}
