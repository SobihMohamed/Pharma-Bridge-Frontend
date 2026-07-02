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

export const usePatientRealTimeUpdates = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const queryClient = useQueryClient();
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:7183';
    
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/notify`, {
        accessTokenFactory: () => token
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
          console.log('Connected to patient real-time notifications hub!');
          
          // 1. General Notifications Listener
          connection.on('ReceiveNotification', (notification: SignalRNotification) => {
            toast.info(notification.subject, {
              description: notification.body,
              duration: 8000,
            });

            // Invalidate global notifications cache to update Bell icon
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          });

          // 2. Order Status Update Listener
          connection.on('ReceiveOrderStatusUpdate', (orderId: number, newStatus: string) => {
            toast.success(`Order #${orderId} status updated to: ${newStatus}`, {
              duration: 6000,
            });

            // CRITICAL CACHE INVALIDATION
            queryClient.invalidateQueries({ queryKey: ['myOrders'] });
            queryClient.invalidateQueries({ queryKey: ['orderDetails', orderId] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          });
        })
        .catch(e => console.error('SignalR Connection failed: ', e));

      return () => {
        connection.off('ReceiveNotification');
        connection.off('ReceiveOrderStatusUpdate');
        connection.stop();
      };
    }
  }, [connection, queryClient]);
};
