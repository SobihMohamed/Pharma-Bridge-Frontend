import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export interface AdminComplaintsParams {
  PageIndex: number;
  PageSize: number;
  Search?: string;
  Status?: string;
  PharmacyId?: string;
}

export const useAdminComplaintsQuery = (params: AdminComplaintsParams) => {
  return useQuery({
    queryKey: ["adminPlatformComplaints", params],
    queryFn: () => adminService.getPlatformComplaints(params),
    placeholderData: keepPreviousData,
  });
};

export const useAllPharmaciesDropdownQuery = () => {
  return useQuery({
    queryKey: ["adminPharmaciesDropdown"],
    queryFn: () => adminService.getAllPharmaciesForDropdown(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useComplaintDetailsQuery = (id: string | number) => {
  return useQuery({
    queryKey: ["adminComplaintDetails", id],
    queryFn: () => adminService.getComplaintById(id),
    enabled: !!id,
  });
};

export const useUpdateComplaintStatusMutation = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { status: string; adminNotes: string }) =>
      adminService.updateComplaintStatusApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminComplaintDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["adminPlatformComplaints"] });
    },
  });
};
