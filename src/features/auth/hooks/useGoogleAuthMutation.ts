import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export interface GoogleAuthRequest {
  idToken: string;
  role?: string;
}

export interface GoogleAuthResponseData {
  message: string;
  isAuthenticated: boolean;
  phoneNumber: string;
  name: string;
  email: string;
  token: string;
  expireOn: string;
  roles: string[];
}

export interface GoogleAuthResponse {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  data: GoogleAuthResponseData;
  errors: string[];
}

export const useGoogleAuthMutation = () => {
  return useMutation<GoogleAuthResponse, Error, GoogleAuthRequest>({
    mutationFn: async (credentials) => {
      // api.post already returns the unwrapped backend JSON
      // (the Axios response interceptor strips response.data for us)
      const result = await api.post('/api/Auth/google-auth', credentials);
      return result as unknown as GoogleAuthResponse;
    },
  });
};
