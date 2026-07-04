import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, GetNotificationsParams } from './notificationService';

export const useNotificationsQuery = (params: GetNotificationsParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh the unread badge and list state
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
