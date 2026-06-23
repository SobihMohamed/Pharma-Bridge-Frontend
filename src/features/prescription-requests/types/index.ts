import { BidDto } from '@/features/bids/types';

export interface CreatePrescriptionRequestDto {
  image: File | null;
  notes?: string;
  deliveryAddressId: string;
}

export interface PrescriptionRequestDto {
  id: string;
  status: 'Pending' | 'Bidding' | 'Completed' | 'Cancelled';
  createdAt: string;
  imageUrl: string | null;
  notes?: string;
  deliveryAddressId: string;
  bids: BidDto[];
}
