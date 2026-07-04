import api from "@/lib/api";
import { PaginationResponse } from "@/types/api.types";

export type PharmaOwnerStatus = "Pending" | "Approved" | "Rejected" | "Blocked" | string;

export interface PharmaOwnerDto {
  id: string;
  fullName: string;
  status: PharmaOwnerStatus;
  email: string;
  phoneNumber: string | null;
}

export interface AdminPharmaOwnersParams {
  PageIndex: number;
  PageSize: number;
  Search?: string;
  Status?: string;
}

export interface PharmaOwnerDetailsDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  status: PharmaOwnerStatus;
  nationalId: string;
  nationalIdFront: string | null;
  nationalIdBack: string | null;
  syndicateCardImage: string | null;
}

export const adminPharmaOwnersService = {
  getPharmaOwners: async (params: AdminPharmaOwnersParams): Promise<PaginationResponse<PharmaOwnerDto>> => {
    const cleanParams: Record<string, any> = {
      PageIndex: params.PageIndex,
      PageSize: params.PageSize,
    };
    if (params.Search) cleanParams.Search = params.Search;
    if (params.Status && params.Status !== "All") cleanParams.Status = params.Status;

    const response = await api.get<PaginationResponse<PharmaOwnerDto>>("/api/pharma-owner-profile/all", {
      params: cleanParams,
    });
    return response.data!;
  },

  getPharmaOwnerById: async (id: string): Promise<PharmaOwnerDetailsDto> => {
    const response = await api.get<PharmaOwnerDetailsDto>(`/api/pharma-owner-profile/${id}`);
    return response.data!;
  },

  updatePharmaOwnerStatus: async (id: string, status: string): Promise<void> => {
    await api.put<void>(`/api/pharma-owner-profile/${id}/status`, {}, {
      params: { status },
    });
  },
};
