import { create } from 'zustand';
import { NotificationDto } from '@/features/notifications/api/notifications';

interface NotificationStore {
  notifications: NotificationDto[];
  unreadCount: number;
  hasNewNotification: boolean;
  lastOptimisticUpdate: number | null;
  addNotification: (notification: NotificationDto) => void;
  setNotifications: (notifications: NotificationDto[], unreadCount: number) => void;
  resetNewNotificationFlag: () => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  hasNewNotification: false,
  lastOptimisticUpdate: null,
  
  addNotification: (notification) => set((state) => {
    // Prevent duplicates
    if (state.notifications.some(n => n.id === notification.id)) return state;
    return {
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
      hasNewNotification: true,
      lastOptimisticUpdate: Date.now()
    };
  }),

  setNotifications: (notifications, unreadCount) => set((state) => {
    // Protect optimistic updates from being immediately overwritten by a stale API fetch (race condition)
    if (state.lastOptimisticUpdate && Date.now() - state.lastOptimisticUpdate < 3000) {
      return state; // Ignore stale server data, keep our optimistic state
    }
    return { 
      notifications, 
      unreadCount 
    };
  }),

  resetNewNotificationFlag: () => set({ 
    hasNewNotification: false 
  }),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0
  }))
}));
