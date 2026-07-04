import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminPharmaOwnersService, AdminPharmaOwnersParams } from "../services/adminPharmaOwnersService";

export const useAdminPharmaOwnersQuery = (params: AdminPharmaOwnersParams) => {
  return useQuery({
    queryKey: ["adminPharmaOwners", params],
    queryFn: () => adminPharmaOwnersService.getPharmaOwners(params),
    placeholderData: keepPreviousData,
  });
};

export const usePharmaOwnerDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["adminPharmaOwnerDetails", id],
    queryFn: () => adminPharmaOwnersService.getPharmaOwnerById(id),
    enabled: !!id,
  });
};

export const useUpdatePharmaOwnerStatusMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => adminPharmaOwnersService.updatePharmaOwnerStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPharmaOwnerDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["adminPharmaOwners"] });
    },
  });
};
