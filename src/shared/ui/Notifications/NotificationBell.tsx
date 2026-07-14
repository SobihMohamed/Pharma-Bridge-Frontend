import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, BellRing } from 'lucide-react';
import { 
  useNotificationsQuery, 
  useMarkAsReadMutation, 
  useMarkAllAsReadMutation 
} from '../../api/notifications/useNotifications';
import { useSignalRNotifications } from '../../hooks/useSignalRNotifications';
import { usePagination } from '../../hooks/usePagination';
import { AppPagination } from '../AppPagination';
import { TimeAgoText } from '../TimeAgoText';

export function NotificationBell() {
  // 1. Initialize SignalR Connection
  useSignalRNotifications();

  // 2. Local State
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 3. Pagination State
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 5 });

  // 4. Queries & Mutations
  const { data, isLoading } = useNotificationsQuery({
    PageIndex: pageIndex,
    PageSize: pageSize
  });
  
  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  const notifications = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const unreadCount = notifications.filter(n => !n.isRead).length; // Usually backend sends totalUnreadCount, but we derive locally for the current page/cache

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: number, isRead: boolean) => {
    if (!isRead) {
      markAsReadMutation.mutate(id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-[#0f172a] shadow-sm transform translate-x-1 -translate-y-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0f172a] rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 z-50 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#0b0f19]">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-gray-500 dark:text-slate-400" />
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-slate-400 animate-pulse">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-gray-300 dark:text-slate-600" />
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">We'll let you know when something arrives.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    notification.isRead 
                      ? 'bg-white dark:bg-[#0f172a] hover:bg-gray-50 dark:hover:bg-slate-800/50' 
                      : 'bg-blue-50/50 dark:bg-blue-500/10 hover:bg-blue-50 dark:hover:bg-blue-500/20 border-l-2 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.isRead ? 'text-gray-700 dark:text-slate-300 font-medium' : 'text-gray-900 dark:text-white font-semibold'}`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs mt-0.5 line-clamp-2 ${notification.isRead ? 'text-gray-500 dark:text-slate-400' : 'text-gray-600 dark:text-slate-300'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-gray-400 dark:text-slate-500 font-medium">
                    <TimeAgoText date={notification.createdAt} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer (Pagination) */}
          {totalCount > pageSize && (
            <div className="p-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-[#0b0f19] flex justify-center scale-90 origin-bottom">
              <AppPagination 
                totalCount={totalCount} 
                currentPage={pageIndex} 
                pageSize={pageSize} 
                onPageChange={setPageIndex} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
