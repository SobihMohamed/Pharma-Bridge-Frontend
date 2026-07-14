import api from "@/lib/api";
import { PaginationResponse } from "@/types/api.types";

export type PharmacyStatus = "Pending" | "Active" | "Blocked" | string;

export interface PharmacyDto {
  id: string | number;
  pharmacyName: string;
  pharmaOwnerName: string;
  email: string;
  phoneNumber: string | null;
  contactPhone: string | null;
  status: PharmacyStatus;
  
  // Optional legacy fields that might still be returned or needed elsewhere
  licenseNumber?: string;
  licenseImageUrl?: string | null;
  latitude?: number;
  longitude?: number;
  openTime?: string;
  closeTime?: string;
  is24Hours?: boolean;
  textAddress?: string;
  area?: string;
  createdAt?: string;
}

export interface PharmacyOwnerInfo {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  status: string;
}

export interface AdminPharmacyDetailsDto {
  id: string;
  pharmacyName: string;
  licenseNumber: string;
  licenseImageUrl: string | null;
  status: PharmacyStatus;
  latitude: number;
  longitude: number;
  is24Hours: boolean;
  openTime: string;
  closeTime: string;
  textAddress: string;
  area: string;
  contactPhone: string;
  averageRating: number;
  completeOrderCount: number;
  registrationDate: string;
  owner: PharmacyOwnerInfo | null;
}

export interface AdminPharmaciesParams {
  PageIndex: number;
  PageSize: number;
  Search?: string;
  Status?: string;
}

export const adminPharmaciesService = {
  getPharmacies: async (params: AdminPharmaciesParams): Promise<PaginationResponse<PharmacyDto>> => {
    const cleanParams: Record<string, any> = {
      PageIndex: params.PageIndex,
      PageSize: params.PageSize,
    };
    if (params.Search) cleanParams.Search = params.Search;
    if (params.Status && params.Status !== "All") cleanParams.Status = params.Status;

    const response = await api.get<PaginationResponse<PharmacyDto>>("/api/pharmacy/all", {
      params: cleanParams,
    });
    return response.data!;
  },

  getPharmacyById: async (id: string): Promise<AdminPharmacyDetailsDto> => {
    const response = await api.get<AdminPharmacyDetailsDto>(`/api/pharmacy/admin/${id}`);
    return response.data!;
  },

  updatePharmacyStatus: async (id: string, status: string): Promise<void> => {
    await api.put<void>(`/api/pharmacy/${id}/status`, {}, {
      params: { status },
    });
  },
};

