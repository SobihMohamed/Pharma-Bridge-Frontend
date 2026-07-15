import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  useGetUnreadNotificationsCountQuery, 
  useGetRecentNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation
} from '@/features/notifications/api/notifications';
import { useNotificationStore } from '@/features/admin/store/useNotificationStore';
import { getRelativeTime } from '@/utils/formatTime';

export function AdminNotificationBell() {
  const [open, setOpen] = useState(false);

  const { data: countData } = useGetUnreadNotificationsCountQuery();
  const { data: recentData, isLoading } = useGetRecentNotificationsQuery();

  // Zustand Store
  const { 
    notifications, 
    unreadCount, 
    hasNewNotification, 
    setNotifications, 
    resetNewNotificationFlag,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead
  } = useNotificationStore();

  // Initialize store when React Query finishes fetching initial data
  React.useEffect(() => {
    if (recentData?.data && countData !== undefined) {
      setNotifications(recentData.data, countData.totalCount);
    }
  }, [recentData, countData, setNotifications]);

  // Reset animation flag after 3 seconds
  React.useEffect(() => {
    if (hasNewNotification) {
      const timer = setTimeout(() => {
        resetNewNotificationFlag();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasNewNotification, resetNewNotificationFlag]);

  const markReadMutation = useMarkNotificationAsReadMutation();
  const markAllMutation = useMarkAllAsReadMutation();

  const handleMarkAllAsRead = () => {
    markAllMutation.mutate();
    storeMarkAllAsRead(); // Optimistic local update
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
      storeMarkAsRead(notification.id); // Optimistic local update
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={`relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:focus-visible:ring-slate-700 ${hasNewNotification ? 'animate-bounce text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800' : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#0b0f19] animate-in zoom-in-0 fade-in-0">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
          <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              disabled={markAllMutation.isPending}
              className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
        
        {/* List */}
        <ScrollArea className="h-auto max-h-[400px]">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="w-6 h-6 border-2 border-slate-200 dark:border-slate-800 border-t-slate-800 dark:border-t-slate-200 rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Loading...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-medium text-slate-900 dark:text-white">All caught up!</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">No recent notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex flex-col cursor-pointer transition-colors relative ${
                    !notification.isRead 
                      ? 'bg-blue-50/50 dark:bg-blue-500/10 border-l-4 border-blue-600 p-4' 
                      : 'bg-white dark:bg-[#0f172a] border-l-4 border-transparent p-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight pr-4">
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600 shadow-sm" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-2 block">
                    {getRelativeTime(notification.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

      </PopoverContent>
    </Popover>
  );
}
