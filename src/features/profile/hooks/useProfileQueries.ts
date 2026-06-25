import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import { PatientQueryParams } from '../types';

export const usePatientProfileQuery = () => {
  return useQuery({
    queryKey: ['patientProfile'],
    queryFn: () => profileService.getMyProfile(),
  });
};

export const useAllPatientsQuery = (params: PatientQueryParams) => {
  return useQuery({
    queryKey: ['adminPatients', params],
    queryFn: () => profileService.getAllPatients(params),
    placeholderData: keepPreviousData,
  });
};
