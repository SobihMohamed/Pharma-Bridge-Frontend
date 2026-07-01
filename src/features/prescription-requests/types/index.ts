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
  expiresAt: string;
  imageUrl: string | null;
  medicineName: string | null;
  patientNotes?: string;
  deliveryArea: string;
  bidsCount: number;
}

export interface PatientOfferItemDto {
  id: number;
  itemName: string;
  unitPrice: number;
  quantity: number;
  isAlternative: boolean;
  alternativeNote?: string | null;
  lineTotal: number;
}

export interface PatientOfferDto {
  id: number;
  totalPrice: number;
  deliveryFee: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';
  notes?: string | null;
  submittedAt: string;
  deliveryTimeInMinutes: number;
  pharmacyName: string;
  pharmacyRating: number;
  bidItems: PatientOfferItemDto[];
}

export interface PrescriptionRequestDetailsDto extends PrescriptionRequestDto {
  bids: PatientOfferDto[];
  deliveryAddressId: string | number;
}

