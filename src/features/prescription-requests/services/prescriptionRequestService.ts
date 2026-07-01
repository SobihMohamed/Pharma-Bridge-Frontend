import api from "@/lib/api";
import { PaginationResponse } from "@/types/api.types";
import { PrescriptionRequestDto, PrescriptionRequestQueryParams, PrescriptionRequestDetailsDto } from "../types";

export const prescriptionRequestService = {
  getPatientRequests: async (params: PrescriptionRequestQueryParams): Promise<PaginationResponse<PrescriptionRequestDto>> => {
    // The response interceptor unwraps AxiosResponse.data -> ApiResponse<PaginationResponse<T>>
    // Which means we get the ApiResponse object and we extract its .data property.
    const response = await api.get<PaginationResponse<PrescriptionRequestDto>>('/api/prescription-requests', { params });
    return (response as any).data;
  },

  getRequestDetails: async (id: number): Promise<PrescriptionRequestDetailsDto> => {
    const response = await api.get<PrescriptionRequestDetailsDto>(`/api/prescription-requests/${id}`);
    return (response as any).data;
  },

  cancelRequest: async (id: number): Promise<string> => {
    const response = await api.patch(`/api/prescription-requests/${id}/cancel`);
    return (response as any).message;
  },

  createRequest: async (formData: FormData): Promise<PrescriptionRequestDto> => {
    // Explicitly set multipart/form-data for this specific call
    const response = await api.post<PrescriptionRequestDto>('/api/prescription-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // api.post returns response.data directly because of our interceptor.
    // The response is of type ApiResponse<PrescriptionRequestDto>, so we extract `.data`
    // Wait, the interceptor extracts `response.data`, which means what's returned is the `ApiResponse<T>` object!
    // Let me check what authService did: `return response.data;` wait, if it returns `response.data` and auth models have it wrapped in `.data`, then `response.data` is the actual payload.
    // Actually, in `authService.ts` we did `return response.data || true;`. Let's assume the interceptor unwraps `AxiosResponse.data` giving us the `ApiResponse` wrapper.
    // To get the actual entity, we need `return response.data`? Or is `response` already the payload? Wait, the API contract is `ApiResponse<PrescriptionRequestDto>`, which has `{ data: PrescriptionRequestDto }`. So returning `response.data` is correct if `response` is the `ApiResponse`. Let's do `return (response as any).data || response;` to be safe, but properly it should be `return (response as unknown as { data: PrescriptionRequestDto }).data`. Let me check `authService.ts`.
    // Wait, the user prompt says: "(e.g., const response = await api.post<ApiResponse<AuthModelDto>>('/api/Auth/login', data); return response.data.data;)". BUT wait, `api.ts` defines `post<T>` to return `ApiResponse<T>`.
    
    // In `authService.ts` we did: `const response = await api.post<AuthModelDto>(...); return response.data;`. So `response` is actually the `ApiResponse<AuthModelDto>`, and we accessed `.data`.
    return (response as any).data;
  },

  respondToBid: async ({ bidId, status }: { bidId: number; status: 'Accepted' | 'Rejected' }): Promise<string> => {
    const response = await api.patch(`/api/bids/${bidId}/status?status=${status}`);
    return (response as any).message || 'Success';
  }
};
