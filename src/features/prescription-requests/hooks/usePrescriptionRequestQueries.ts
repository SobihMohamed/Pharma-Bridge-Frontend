import { useEffect } from 'react';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useSignalR } from '@/hooks/useSignalR';
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

/**
 * Patient-facing alias for getting request details.
 * Includes placeholder for Real-Time (SignalR) cache invalidation.
 */
export const useGetPatientRequestDetailsQuery = (id: number) => {
  const queryClient = useQueryClient();
  const { connection, startConnection, onEvent } = useSignalR();
  
  // REAL-TIME PREP:
  useEffect(() => {
    startConnection();
    onEvent('ReceiveBidUpdate', (updatedRequestId: number) => {
      // Invalidate if the update is for this exact request
      if (Number(updatedRequestId) === Number(id)) {
        queryClient.invalidateQueries({ queryKey: ['requestDetails', id] });
      }
    });
  }, [id, queryClient, startConnection, onEvent]);

  return useQuery({
    queryKey: ['requestDetails', id],
    queryFn: () => prescriptionRequestService.getRequestDetails(id),
    enabled: !!id,
    refetchInterval: 10000, // Optional fallback polling if SignalR drops
  });
};
