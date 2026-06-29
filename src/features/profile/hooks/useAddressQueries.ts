import { useQuery } from '@tanstack/react-query';
import { addressService } from '../services/addressService';
import { usePatientProfileQuery } from './useProfileQueries';

export const usePatientAddressesQuery = () => {
  const { data: profileData, isSuccess: isProfileLoaded } = usePatientProfileQuery();

  return useQuery({
    queryKey: ['patientAddresses'],
    queryFn: () => addressService.getAddresses(),
    enabled: isProfileLoaded && !!profileData,
  });
};
