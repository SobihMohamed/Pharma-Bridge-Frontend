import { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { NearbyRequestDto } from '../types';
import { PaginationResponse } from '@/types/api.types';
import { useLiveRequestsStore } from '../stores/useLiveRequestsStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SignalRNotification {
  id: number;
  subject: string;
  body: string;
  referenceId: number;
  date: string;
  requestData: NearbyRequestDto;
}

interface BidStatusUpdatePayload {
  bidId: number;
  status: 'Accepted' | 'Rejected';
}

export const usePharmacyRealTimeUpdates = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const queryClient = useQueryClient();
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();

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
          
          // -------------------------------------------------------------
          // 1. General Live Requests / Notifications Listener
          // -------------------------------------------------------------
          connection.on('ReceiveNotification', (notification: SignalRNotification) => {
            const subject = notification.subject || '';
            const lowerSubject = subject.toLowerCase();
            
            const isPharmacyApproved = lowerSubject.includes('pharmacy approved') || lowerSubject.includes('صيدلية') || subject.includes('🏪');
            const isAccountApproved = lowerSubject.includes('approved') || lowerSubject.includes('موافقة');
            
            if (isPharmacyApproved && isAccountApproved) {
              toast.success("🏪 Your pharmacy has been approved! You can now receive nearby requests.", {
                description: notification.body,
                duration: 10000,
              });
              
              // CRITICAL: Force refetch of profile to instantly unlock sidebar tabs!
              queryClient.invalidateQueries({ queryKey: ['myPharmacyProfile'] });
            } else if (isAccountApproved) {
              toast.success("🎉 Congratulations! Your account has been approved.", {
                description: notification.body,
                duration: 10000,
              });
              
              // CRITICAL: Force refetch of profile to instantly unlock sidebar tabs!
              queryClient.invalidateQueries({ queryKey: ['myPharmacyProfile'] });
            } else {
              // Trigger standard premium toast alert
              toast.info(notification.subject, {
                description: notification.body,
                duration: 8000,
                action: {
                  label: 'View Live',
                  onClick: () => navigate('/pharmacy/radar'),
                },
              });
            }

            // If the notification contains request payload, update both stores
            if (notification.requestData) {
              const payload = notification.requestData;

              // Update React Query cache for NearbyRequestsPage
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

              // Push into the Zustand live-feed store
              useLiveRequestsStore.getState().addLiveRequest(payload as any);
            }

            // Invalidate global notifications cache
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          });

          // -------------------------------------------------------------
          // 2. Bid Status Update Listener (Accepted / Rejected)
          // -------------------------------------------------------------
          connection.on('ReceiveBidStatusUpdate', (payload: BidStatusUpdatePayload) => {
            const { status } = payload;
            
            // Dynamic Toast UI
            if (status === 'Accepted') {
              toast.success("🎉 Congratulations! A patient accepted your bid. Check your Active Orders.");
            } else if (status === 'Rejected') {
              toast.error("❌ A patient declined your bid. It has been moved to history.");
            }

            // CRITICAL CACHE INVALIDATION
            // Invalidate Notifications to instantly increment Header Bell unread count
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            
            // Invalidate Bids query to refresh My Bids UI
            queryClient.invalidateQueries({ queryKey: ['pharmacyBids'] });
            
            // Invalidate Active Orders so accepted bids appear in the pipeline instantly
            queryClient.invalidateQueries({ queryKey: ['pharmacyOrders'] });
          });
        })
        .catch(e => console.error('SignalR Connection failed: ', e));

      return () => {
        connection.off('ReceiveNotification');
        connection.off('ReceiveBidStatusUpdate');
        connection.stop();
      };
    }
  }, [connection, queryClient, navigate]);
};
