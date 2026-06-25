export interface PatientProfileDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  totalPrescriptionRequests: number;
  ordersCount: number;
  complaintsSubmitted: number;
  addresses: PatientAddressDto[];
}

export interface PatientProfileToUpdateDto {
  fullName: string;
  phoneNumber: string;
}

export interface PatientQueryParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
}

export interface PatientAddressDto {
  id: number;
  addressLine: string;
  city: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface CreatePatientAddressDto {
  addressLine: string;
  city: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface UpdatePatientAddressDto {
  addressLine: string;
  city: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}
