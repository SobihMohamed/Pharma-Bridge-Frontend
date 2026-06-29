import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export interface AdminPrescriptionRequestsParams {
  PageIndex: number;
  PageSize: number;
  Search?: string;
  Status?: string;
  PatientId?: string;
  FromDate?: string;
  ToDate?: string;
  RadiusInKm?: number;
}

export const useAdminPrescriptionRequestsQuery = (params: AdminPrescriptionRequestsParams) => {
  return useQuery({
    queryKey: ["adminPrescriptionRequests", params],
    queryFn: () => adminService.getPrescriptionRequests(params),
    placeholderData: keepPreviousData,
  });
};

export const useAllPatientsDropdownQuery = () => {
  return useQuery({
    queryKey: ["adminPatientsDropdown"],
    queryFn: () => adminService.getAllPatientsForDropdown(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since patient list rarely changes
  });
};

export const useAdminPrescriptionRequestDetailsQuery = (id: string | number) => {
  return useQuery({
    queryKey: ["adminPrescriptionRequestDetails", id],
    queryFn: () => adminService.getPrescriptionRequestDetails(id),
    enabled: !!id,
  });
};
