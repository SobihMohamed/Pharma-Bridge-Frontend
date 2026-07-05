import { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { toast } from 'sonner';

interface SignalRNotification {
  id: number;
  subject: string;
  body: string;
  referenceId: number;
  date: string;
}

export const useAdminSignalR = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      console.log('useAdminSignalR: No token found, aborting connection.');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:7183';
    console.log('useAdminSignalR: Building connection to', `${apiUrl}/notify`);

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/notify`, {
        accessTokenFactory: () => useAuthStore.getState().token || ""
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('Admin SignalR State:', connection.state);
          console.log('Connected to admin real-time notifications hub!');
          
          connection.on('ReceiveNotification', (notification: SignalRNotification) => {
            console.log("Admin Notification Received:", notification);
            
            const subject = notification.subject || 'New Notification';
            const lowerSubject = subject.toLowerCase();
            
            const isPharmacyLocation = lowerSubject.includes('pharmacy registration') || subject.includes('🏪');
            const isPharmacyOwner = lowerSubject.includes('pharmacy') || lowerSubject.includes('صيدلية');
            const isComplaint = lowerSubject.includes('complaint') || lowerSubject.includes('شكوى');

            if (isPharmacyLocation) {
              toast.info(subject, {
                description: notification.body,
                duration: 8000,
                icon: '🏪',
              });
            } else if (isPharmacyOwner) {
              toast.success(subject, {
                description: notification.body,
                duration: 8000,
                icon: '👨‍⚕️',
              });
            } else if (isComplaint) {
              toast.warning(subject, {
                description: notification.body,
                duration: 8000,
                icon: '⚠️',
              });
            } else {
              toast.info(subject, {
                description: notification.body,
                duration: 8000,
              });
            }

            // Invalidate the EXACT query keys to trigger the bell icon counter update
            queryClient.invalidateQueries({ queryKey: ['adminUnreadCount'] });
            queryClient.invalidateQueries({ queryKey: ['adminRecentNotifications'] });
            
            // Also invalidate general complaints/orders if needed
            queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
          });
        })
        .catch(e => {
          console.error('SignalR Connection failed: ', e);
          console.log('Admin SignalR State:', connection.state);
        });

      return () => {
        connection.off('ReceiveNotification');
        connection.stop();
      };
    }
  }, [connection, queryClient]);
};
