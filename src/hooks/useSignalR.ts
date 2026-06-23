import { useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '@/features/auth/store/authStore';
import { API_ENDPOINTS } from '@/utils/constants';

export const useSignalR = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_API_URL + API_ENDPOINTS.SIGNALR.HUB, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [token, isAuthenticated]);

  const startConnection = useCallback(async () => {
    if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await connection.start();
        console.log('SignalR Connected.');
      } catch (err) {
        console.error('SignalR Connection Error: ', err);
        setTimeout(startConnection, 5000); // Retry logic
      }
    }
  }, [connection]);

  const stopConnection = useCallback(async () => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      await connection.stop();
    }
  }, [connection]);

  const onEvent = useCallback(
    (eventName: string, callback: (...args: any[]) => void) => {
      if (connection) {
        connection.on(eventName, callback);
      }
    },
    [connection]
  );

  return { connection, startConnection, stopConnection, onEvent };
};
