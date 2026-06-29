import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export interface AdminOrdersParams {
  PageIndex: number;
  PageSize: number;
  Search?: string;
  Status?: string;
  FromDate?: string;
  ToDate?: string;
  PharmacyId?: string;
  PatientId?: string;
}

export const useAdminOrdersQuery = (params: AdminOrdersParams) => {
  return useQuery({
    queryKey: ["adminOrders", params],
    queryFn: () => adminService.getOrders(params),
    placeholderData: keepPreviousData,
  });
};

export const useAdminOrderDetailsQuery = (id: string | number) => {
  return useQuery({
    queryKey: ["adminOrderDetails", id],
    queryFn: () => adminService.getOrderDetails(id),
    enabled: !!id,
  });
};

