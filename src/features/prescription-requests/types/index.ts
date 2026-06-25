import { BidDto } from '@/features/bids/types';

export interface CreatePrescriptionRequestDto {
  image: File | null;
  notes?: string;
  deliveryAddressId: string;
}

export type RequestStatus = 'Pending' | 'HasBids' | 'Closed' | 'Cancelled';

export interface PrescriptionRequestQueryParams {
  Status?: RequestStatus | '';
  PatientId?: string;
  FromDate?: string;
  ToDate?: string;
  RadiusInKm?: number;
  PageIndex?: number;
  PageSize?: number;
  Search?: string;
}

export interface PrescriptionRequestDto {
  id: string | number;
  status: RequestStatus;
  createdAt: string;
  imageUrl: string | null;
  medicineName?: string | null;
  notes?: string;
  deliveryAddressId: string | number;
  bids: BidDto[];
}

export type PrescriptionRequestDetailsDto = PrescriptionRequestDto;

