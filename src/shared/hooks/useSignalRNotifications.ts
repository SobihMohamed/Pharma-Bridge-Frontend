import { useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { AppNotification } from '../api/notifications/notificationService';
import { PaginationResponse } from '@/types/api.types';
import { toast } from 'sonner';

interface PushNotificationDto {
  userId?: string;
  subject?: string;
  title?: string;
  body?: string;
  message?: string;
  referenceId?: number | null;
  payload?: any;
  id?: number;
  isRead?: boolean;
  createdAt?: string;
  type?: string;
}

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
    connection.on('ReceiveNotification', (newNotification: PushNotificationDto) => {
      const displayTitle = newNotification.subject || newNotification.title || 'New Notification';
      const displayMessage = newNotification.body || newNotification.message || '';

      // Display the toast notification
      toast.info(displayTitle, {
        description: displayMessage,
        duration: 8000,
      });

      // For Pharmacy Owner: dynamically update the UI state when they get the Pending Approval status
      const isProfileUpdate = 
        displayTitle.includes('Account Update Status') || 
        displayTitle.includes('Pharmacy Profile Update') || 
        displayTitle.includes('Pharmacy Update Status') || 
        displayTitle.includes('Pharmacy Details Update');

      if (isProfileUpdate) {
        queryClient.invalidateQueries({ queryKey: ['ownerProfile'] });
        queryClient.invalidateQueries({ queryKey: ['myPharmacyProfile'] });
      }

      // Map to AppNotification for the global list
      const mappedNotification: AppNotification = {
        id: newNotification.id || Date.now(),
        title: displayTitle,
        message: displayMessage,
        isRead: newNotification.isRead || false,
        createdAt: newNotification.createdAt || new Date().toISOString(),
        type: newNotification.type || 'System',
      };

      // Optimistically update the React Query cache
      queryClient.setQueriesData<PaginationResponse<AppNotification>>(
        { queryKey: ['notifications'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          
          return {
            ...oldData,
            totalCount: oldData.totalCount + 1,
            // Prepend the new notification to the top of the current page
            data: [mappedNotification, ...oldData.data]
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
