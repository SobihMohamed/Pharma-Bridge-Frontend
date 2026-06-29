import { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { NearbyRequestDto } from '../types';
import { PaginationResponse } from '@/types/api.types';
import { useLiveRequestsStore } from '../stores/useLiveRequestsStore';
import { toast } from 'sonner';

interface SignalRNotification {
  id: number;
  subject: string;
  body: string;
  referenceId: number;
  date: string;
  requestData: NearbyRequestDto;
}

export const useSignalRNotifications = () => {
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
          console.log('Connected to real-time notifications hub!');
          
          connection.on('ReceiveNotification', (notification: SignalRNotification) => {
            // Trigger a premium toast alert
            toast.info(notification.subject, {
              description: notification.body,
              duration: 5000,
            });

            // If the notification contains request payload, update both stores
            if (notification.requestData) {
              const payload = notification.requestData;

              // 1. Update React Query cache for NearbyRequestsPage
              queryClient.setQueriesData(
                { queryKey: ['nearby-requests'] }, 
                (oldData: PaginationResponse<NearbyRequestDto> | undefined) => {
                  if (!oldData) return oldData;
                  
                  const exists = oldData.data.some(r => r.id === payload.id);
                  if (exists) return oldData;
                  
                  return {
                    ...oldData,
                    totalCount: oldData.totalCount + 1,
                    data: [payload, ...oldData.data]
                  };
                }
              );

              // 2. Push into the Zustand live-feed store for LiveRequestsPage
              useLiveRequestsStore.getState().addLiveRequest(payload as any);
            }
          });
        })
        .catch(e => console.error('SignalR Connection failed: ', e));

      return () => {
        connection.off('ReceiveNotification');
        connection.stop();
      };
    }
  }, [connection, queryClient]);
};
