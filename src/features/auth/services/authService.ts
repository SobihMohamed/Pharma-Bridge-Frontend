import api from "@/lib/api";
import { RegisterDto, LoginDto, AuthModelDto } from "@/types/auth.types";

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
  }
};
