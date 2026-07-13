import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { NotificationBell } from '@/shared/ui/Notifications/NotificationBell';

interface PharmacyTopNavProps {
  onMenuToggle: () => void;
  isSidebarCollapsed?: boolean;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const PharmacyTopNav: React.FC<PharmacyTopNavProps> = ({ 
  onMenuToggle, 
  isSidebarCollapsed,
  darkMode = false,
  onToggleDarkMode
}) => {
  const { user, clearAuth } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || 'Pharmacy User';
  const displayEmail = user?.email || 'user@pharmacy.com';

  return (
    <header
      className={`bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 z-40 transition-[left] duration-300 ease-in-out dark:bg-[#0f172a] dark:border-slate-800 ${
        isSidebarCollapsed ? 'md:left-20' : 'md:left-64'
      }`}
    >
      <div className="flex justify-between items-center h-full px-6">
        {/* Left Side: Mobile Menu Trigger */}
        <div className="flex items-center">
          <button 
            onClick={onMenuToggle}
            className="md:hidden text-gray-500 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-950 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="flex items-center -mr-2">
            <NotificationBell />
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 dark:hover:bg-slate-800 dark:hover:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-200 dark:border-teal-800">
                {getInitials(displayName)}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-slate-200">
                {displayName}
              </span>
              <ChevronDown className={`hidden sm:block w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#131b2e] rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 py-1 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">{displayEmail}</p>
                </div>
                
                <div className="p-1">
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      clearAuth();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};