import { useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { AppNotification } from '../api/notifications/notificationService';
import { PaginationResponse } from '@/types/api.types';

export const useSignalRNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Connect to the global notifications hub
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL || 'https://localhost:7183'}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection.start()
      .then(() => console.log('SignalR Notification Hub Connected'))
      .catch(err => console.error('SignalR Notification Hub Connection Error:', err));

    // Listen for real-time notifications
    connection.on('ReceiveNotification', (newNotification: AppNotification) => {
      // Optimistically update the React Query cache
      queryClient.setQueriesData<PaginationResponse<AppNotification>>(
        { queryKey: ['notifications'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          
          return {
            ...oldData,
            totalCount: oldData.totalCount + 1,
            // Prepend the new notification to the top of the current page
            data: [newNotification, ...oldData.data]
          };
        }
      );
    });

    // Cleanup on unmount
    return () => {
      connection.off('ReceiveNotification');
      connection.stop();
    };
  }, [queryClient]);
};
