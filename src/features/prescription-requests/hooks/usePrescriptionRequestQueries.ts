import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { prescriptionRequestService } from '../services/prescriptionRequestService';
import { PrescriptionRequestQueryParams } from '../types';

export const usePatientRequestsQuery = (params: PrescriptionRequestQueryParams) => {
  return useQuery({
    queryKey: ['patientRequests', params],
    queryFn: () => prescriptionRequestService.getPatientRequests(params),
    placeholderData: keepPreviousData,
  });
};

export const useRequestDetailsQuery = (id: number) => {
  return useQuery({
    queryKey: ['requestDetails', id],
    queryFn: () => prescriptionRequestService.getRequestDetails(id),
    enabled: !!id,
  });
};
