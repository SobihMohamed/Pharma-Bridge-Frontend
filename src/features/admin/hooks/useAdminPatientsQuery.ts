import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export const useAdminPatientsQuery = (params: { PageIndex: number; PageSize: number; Search?: string }) => {
  return useQuery({
    queryKey: ["adminPatients", params],
    queryFn: () => adminService.getPatients(params),
    placeholderData: keepPreviousData,
  });
};
