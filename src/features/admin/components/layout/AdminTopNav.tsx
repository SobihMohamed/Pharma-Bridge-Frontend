import { NotificationBell } from '@/shared/ui/Notifications/NotificationBell';
import { Moon, Sun } from 'lucide-react';

interface AdminTopNavProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function AdminTopNav({
  title = "PharmaBridge Admin",
  showBack = false,
  onBack,
  isSidebarCollapsed = false,
  onToggleSidebar,
  darkMode = false,
  onToggleDarkMode,
}: AdminTopNavProps) {
  return (
    <header className={`flex justify-between items-center h-16 px-6 sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ${isSidebarCollapsed ? "ml-0" : "ml-64"}`}>
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="material-symbols-outlined text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? "menu" : "menu_open"}
        </button>
        {showBack && (
          <button
            onClick={onBack}
            className="material-symbols-outlined text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            arrow_back
          </button>
        )}
        <h2 className="font-bold text-xl text-slate-900 dark:text-slate-100 whitespace-nowrap">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <NotificationBell />
      </div>
    </header>
  );
}
