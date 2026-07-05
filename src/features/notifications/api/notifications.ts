import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  referenceId: number;
}

export interface PaginatedNotificationsResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: NotificationDto[];
}

export interface GetNotificationsParams {
  IsRead?: boolean;
  PageIndex?: number;
  PageSize?: number;
  Search?: string;
}

export const notificationsApi = {
  getNotifications: async (params: GetNotificationsParams): Promise<PaginatedNotificationsResponse> => {
    const response = await api.get('/api/notifications', { params });
    return (response as any).data;
  },
  markAsRead: async (id: number): Promise<void> => {
    await api.patch(`/api/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/api/notifications/read-all');
  }
};

export const useGetUnreadNotificationsCountQuery = () => {
  return useQuery({
    queryKey: ['adminUnreadCount'],
    queryFn: () => notificationsApi.getNotifications({ IsRead: false, PageIndex: 1, PageSize: 1 }),
  });
};

export const useGetRecentNotificationsQuery = () => {
  return useQuery({
    queryKey: ['adminRecentNotifications'],
    queryFn: () => notificationsApi.getNotifications({ PageIndex: 1, PageSize: 5 }),
  });
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUnreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['adminRecentNotifications'] });
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUnreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['adminRecentNotifications'] });
    },
  });
};
