import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

interface NavItem {
  label: string;
  icon: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", to: "/admin/dashboard" },
  { label: "Patients", icon: "group", to: "/admin/patients" },
  { label: "Prescriptions", icon: "description", to: "/admin/prescription-requests" },
  { label: "Bids", icon: "local_offer", to: "/admin/bids" },
  { label: "Complaints", icon: "report_problem", to: "/admin/complaints" },
  { label: "Orders", icon: "shopping_cart", to: "/admin/orders" },
];

interface AdminSidebarProps {
  userName?: string;
  userRole?: string;
  userAvatarUrl?: string;
  isCollapsed?: boolean;
}

export default function AdminSidebar({
  userName = "Admin User",
  userRole = "System Root",
  userAvatarUrl,
  isCollapsed = false,
}: AdminSidebarProps) {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return (
    <aside className={`h-screen w-64 fixed left-0 top-0 bg-surface dark:bg-inverse-surface border-r border-outline-variant dark:border-outline flex flex-col py-4 z-50 transition-transform duration-300 ${isCollapsed ? "-translate-x-full" : "translate-x-0"}`}>
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[20px]">medication</span>
        </div>
        <div>
          <h1 className="font-display-sm text-display-sm font-bold text-primary dark:text-primary-fixed leading-tight">
            PharmaBridge
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant opacity-70">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary border-l-4 border-primary opacity-90"
                  : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low",
              ].join(" ")
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label-md text-label-md">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 pt-4 border-t border-outline-variant mt-auto space-y-3">
        <div className="flex items-center gap-3">
          {userAvatarUrl ? (
            <img
              className="w-8 h-8 rounded-full object-cover border border-outline-variant"
              src={userAvatarUrl}
              alt={userName}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden flex-1">
            <p className="font-label-md text-label-md truncate">{userName}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider truncate">{userRole}</p>
          </div>
        </div>

        <button
          onClick={() => clearAuth()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-label-md text-label-md font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
