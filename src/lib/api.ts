import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiError, ApiResponse } from "@/types/api.types";

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7183",
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    // Access store lazily to prevent circular dependencies
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  // @ts-expect-error Axios types don't perfectly support returning data directly from interceptors
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Extract and return response.data as-is
    return response.data;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    const status = error.response?.status;
    const responseData = error.response?.data;

    let apiError: ApiError = {
      statusCode: status || 500,
      message: "An unexpected error occurred",
      errors: null,
    };

    if (status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    } else if (status === 429) {
      import("sonner").then(({ toast }) => {
        toast.error("You have exceeded the request limit. Please try again in 2 minutes.");
      });
      apiError = {
        statusCode: 429,
        message: "Too Many Requests",
        errors: null,
      };
    } else if (status === 400 && responseData) {
      let parsedErrors: string[] | null = null;
      if (Array.isArray(responseData.errors)) {
        parsedErrors = responseData.errors;
      } else if (responseData.errors && typeof responseData.errors === 'object') {
        parsedErrors = Object.values(responseData.errors).flat() as string[];
      }

      apiError = {
        statusCode: 400,
        message: responseData.message || (responseData as any).title || "Bad Request",
        errors: parsedErrors,
      };
    } else if (status === 404 && responseData) {
      apiError = {
        statusCode: 404,
        message: responseData.message || "Not Found",
        errors: null,
      };
    } else if (status === 500) {
      apiError = {
        statusCode: 500,
        message: "Internal Server Error. Please try again later.",
        errors: null,
      };
    }

    return Promise.reject(apiError);
  }
);

const api = {
  get: <T>(url: string, config = {}) =>
    apiInstance.get<ApiResponse<T>, ApiResponse<T>>(url, config),
  post: <T>(url: string, data = {}, config = {}) =>
    apiInstance.post<ApiResponse<T>, ApiResponse<T>>(url, data, config),
  put: <T>(url: string, data = {}, config = {}) =>
    apiInstance.put<ApiResponse<T>, ApiResponse<T>>(url, data, config),
  patch: <T>(url: string, data = {}, config = {}) =>
    apiInstance.patch<ApiResponse<T>, ApiResponse<T>>(url, data, config),
  delete: <T>(url: string, config = {}) =>
    apiInstance.delete<ApiResponse<T>, ApiResponse<T>>(url, config),
};

export default api;
