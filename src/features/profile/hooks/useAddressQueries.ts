import { useQuery } from '@tanstack/react-query';
import { addressService } from '../services/addressService';

export const usePatientAddressesQuery = () => {
  return useQuery({
    queryKey: ['patientAddresses'],
    queryFn: () => addressService.getAddresses(),
  });
};
