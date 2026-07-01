import api from '@/lib/api';
import { PaginationResponse } from '@/types/api.types';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
  actionUrl?: string;
}

export interface GetNotificationsParams {
  IsRead?: boolean;
  PageIndex?: number;
  PageSize?: number;
  Search?: string;
}

export const notificationService = {
  getNotifications: async (params: GetNotificationsParams = {}) => {
    const { data } = await api.get<PaginationResponse<AppNotification>>('/api/notifications', { params });
    return data;
  },
  
  markAsRead: async (id: number) => {
    const { data } = await api.patch(`/api/notifications/${id}/read`);
    return data;
  },
  
  markAllAsRead: async () => {
    const { data } = await api.patch('/api/notifications/read-all');
    return data;
  }
};
