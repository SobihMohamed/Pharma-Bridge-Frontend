import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export interface AdminBidsParams {
  PageIndex: number;
  PageSize: number;
  Search?: string;
  Status?: string;
  PrescriptionRequestId?: string;
  FromDate?: string;
  ToDate?: string;
}

export const useAdminBidsQuery = (params: AdminBidsParams) => {
  return useQuery({
    queryKey: ["adminBids", params],
    queryFn: () => adminService.getAdminBids(params),
    placeholderData: keepPreviousData,
  });
};

export const useAdminBidDetailsQuery = (id: string | number) => {
  return useQuery({
    queryKey: ["adminBidDetails", id],
    queryFn: () => adminService.getAdminBidDetails(id),
    enabled: !!id,
  });
};
