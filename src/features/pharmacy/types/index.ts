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
}
