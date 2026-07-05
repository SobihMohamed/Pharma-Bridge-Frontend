import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import { useAdminSignalR } from "../../hooks/useAdminSignalR";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

/**
 * AdminLayout — the main wrapper for the admin side.
 * Equivalent to PharmacyLayout.tsx in the target structure: renders the fixed
 * sidebar, the sticky top nav, and the scrollable content area for each page.
 */
export default function AdminLayout({
  children,
  title,
  showBack,
  onBack,
}: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  useAdminSignalR(); // Mount SignalR globally for Admin context

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md">
      <AdminSidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-col min-h-screen">
        <AdminTopNav
          title={title}
          showBack={showBack}
          onBack={onBack}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "ml-0" : "ml-64"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
