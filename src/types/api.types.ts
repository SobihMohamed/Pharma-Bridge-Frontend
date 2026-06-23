export interface ApiResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  data: T | null;
  errors: string[] | null;
}

export interface PaginationResponse<T> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors: string[] | null;
}
