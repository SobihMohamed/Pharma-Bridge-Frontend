import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminPharmaciesService, AdminPharmaciesParams } from "../services/adminPharmaciesService";

export const useAdminPharmaciesQuery = (params: AdminPharmaciesParams) => {
  return useQuery({
    queryKey: ["adminPharmacies", params],
    queryFn: () => adminPharmaciesService.getPharmacies(params),
    placeholderData: keepPreviousData,
  });
};

export const usePharmacyDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["adminPharmacyDetails", id],
    queryFn: () => adminPharmaciesService.getPharmacyById(id),
    enabled: !!id,
  });
};

export const useUpdatePharmacyStatusMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => adminPharmaciesService.updatePharmacyStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPharmacyDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["adminPharmacies"] });
    },
  });
};
