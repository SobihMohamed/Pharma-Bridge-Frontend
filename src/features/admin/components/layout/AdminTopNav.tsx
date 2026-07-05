import { AdminNotificationBell } from './AdminNotificationBell';

interface AdminTopNavProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function AdminTopNav({
  title = "PharmaBridge Admin",
  showBack = false,
  onBack,
  isSidebarCollapsed = false,
  onToggleSidebar,
}: AdminTopNavProps) {
  return (
    <header className={`flex justify-between items-center h-12 px-6 sticky top-0 z-40 bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline transition-all duration-300 ${isSidebarCollapsed ? "ml-0" : "ml-64"}`}>
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1 rounded-md hover:bg-surface-container-low"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? "menu" : "menu_open"}
        </button>
        {showBack && (
          <button
            onClick={onBack}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            arrow_back
          </button>
        )}
        <h2 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed whitespace-nowrap">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <AdminNotificationBell />
      </div>
    </header>
  );
}
