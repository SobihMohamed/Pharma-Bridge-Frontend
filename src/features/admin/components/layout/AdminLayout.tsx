import { ReactNode, useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import { useAdminSignalR } from "../../hooks/useAdminSignalR";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function AdminLayout({
  children,
  title,
  showBack,
  onBack,
}: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  useAdminSignalR(); // Mount SignalR globally for Admin context

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('admin-theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <AdminSidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-col min-h-screen">
        <AdminTopNav
          title={title}
          showBack={showBack}
          onBack={onBack}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
        <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "ml-0" : "ml-64"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
