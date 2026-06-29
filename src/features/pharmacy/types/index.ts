export interface PharmacyToCreateDto {
  PharmacyName: string;
  LicenseNumber: string;
  LicenseImage: File | null;
  Latitude: number;
  Longitude: number;
  OpenTime: string;
  CloseTime: string;
  Is24Hours: boolean;
  TextAddress: string;
  Area: string;
  ContactPhone: string;
}

export interface PharmacyToUpdateDto {
  PharmacyName?: string;
  LicenseNumber?: string;
  LicenseImage?: File | null;
  Latitude?: number;
  Longitude?: number;
  OpenTime?: string;
  CloseTime?: string;
  Is24Hours?: boolean;
  TextAddress?: string;
  Area?: string;
  ContactPhone?: string;
}

export interface PharmacyProfileDto {
  id: string;
  pharmacyName: string;
  licenseNumber: string;
  licenseImageUrl: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  is24Hours: boolean;
  textAddress: string;
  area: string;
  contactPhone: string;
  createdAt: string;
  isApproved: boolean;
  status: string;
}

export interface NearbyRequestDto {
  id: number;
  medicineName: string | null;
  status: string;
  patientNotes: string;
  imageUrl: string | null;
  expiresAt: string;
  createdAt: string;
  bidsCount: number;
  deliveryArea: string;
}

export interface LivePharmacyRequest {
  id: number;
  medicineName: string | null;
  imageUrl: string | null;
  patientNotes: string | null;
  status: string | number;
  createdAt: string;
  expiresAt: string;
  deliveryArea: string;
}
