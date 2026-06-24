import api from "@/lib/api";
import { RegisterDto, LoginDto, AuthModelDto, ForgetPasswordDto, VerifyOtpDto, ResetPasswordDto } from "@/types/auth.types";

export const authService = {
  register: async (data: RegisterDto): Promise<AuthModelDto> => {
    const response = await api.post<AuthModelDto>('/api/Auth/register', data);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthModelDto> => {
    const response = await api.post<AuthModelDto>('/api/Auth/login', data);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  },

  forgetPassword: async (data: ForgetPasswordDto): Promise<string> => {
    // The interceptor unwraps AxiosResponse.data, so we receive ApiResponse<string>
    const response = await api.post<string>('/api/Auth/forget-password', data);
    return response.message; 
  },

  verifyOtp: async (data: VerifyOtpDto): Promise<boolean> => {
    const response = await api.post<boolean>('/api/Auth/verify-otp', data);
    return response.isSuccess || true;
  },

  resetPassword: async (data: ResetPasswordDto): Promise<AuthModelDto> => {
    const response = await api.post<AuthModelDto>('/api/Auth/reset-password', data);
    if (!response.data) throw new Error("No data returned from server");
    return response.data;
  }
};
