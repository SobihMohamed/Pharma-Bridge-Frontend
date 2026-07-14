import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { CSSProperties } from "react";
import logo from '@/assets/logo.png';

interface NavItem {
  label: string;
  icon: string;
  to: string;
}

const MAIN_NAV: NavItem[] = [
  { label: "Dashboard",      icon: "dashboard",     to: "/admin/dashboard" },
  { label: "Patients",       icon: "group",         to: "/admin/patients" },
  { label: "Pharma Owners",  icon: "badge",         to: "/admin/pharma-owners" },
  { label: "Pharmacies",     icon: "store",         to: "/admin/pharmacies" },
];

const OPERATIONS_NAV: NavItem[] = [
  { label: "Prescriptions",  icon: "description",   to: "/admin/prescription-requests" },
  { label: "Bids",           icon: "local_offer",   to: "/admin/bids" },
  { label: "Complaints",     icon: "report_problem",to: "/admin/complaints" },
  { label: "Orders",         icon: "shopping_cart", to: "/admin/orders" },
];

// Color dot per operations item
const OP_COLORS = ["bg-orange-400", "bg-blue-500", "bg-red-400", "bg-violet-500"];

interface AdminSidebarProps {
  userName?: string;
  userRole?: string;
  userAvatarUrl?: string;
  isCollapsed?: boolean;
}

const AVATAR_BACKGROUNDS = [
  { from: "#0ea5e9", to: "#0369a1" },
  { from: "#10b981", to: "#0f766e" },
  { from: "#f59e0b", to: "#ea580c" },
  { from: "#f43f5e", to: "#db2777" },
  { from: "#8b5cf6", to: "#4f46e5" },
];

const LOGO_GRADIENT: CSSProperties = {
  backgroundImage: "linear-gradient(135deg, #0ea5e9, #0369a1)",
};

function getAvatarBackground(name: string): CSSProperties {
  const seed = name.trim().toLowerCase();
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = AVATAR_BACKGROUNDS[hash % AVATAR_BACKGROUNDS.length];

  return {
    backgroundImage: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
  };
}

export default function AdminSidebar({
  userName = "Admin User",
  userRole = "System Root",
  userAvatarUrl,
  isCollapsed = false,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    navigate("/admin/login");
  };

  return (
    <aside
      className={`
        h-screen w-64 fixed left-0 top-0 z-50 flex flex-col
        bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        transition-transform duration-300
        ${isCollapsed ? "-translate-x-full" : "translate-x-0"}
      `}
    >
      {/* ── Logo ───────────────────────────────────────────── */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800">
        <img src={logo} alt="PharmaBridge Logo" className="w-10 h-10 rounded-full object-contain shadow-sm shrink-0" />
        <div>
          <h1 className="text-[15px] font-black text-slate-800 dark:text-white leading-none tracking-tight">
            PharmaBridge
          </h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
            Admin Portal
          </p>
        </div>
      </div>

      {/* ── Scrollable nav ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 px-4">

        {/* MAIN MENU */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>
          <nav className="space-y-0.5">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`material-symbols-outlined text-[20px] ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* OPERATIONS */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">
            Operations
          </p>
          <nav className="space-y-0.5">
            {OPERATIONS_NAV.map((item, idx) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${OP_COLORS[idx % OP_COLORS.length]}`}
                    />
                    <span className={isActive ? "text-white" : ""}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Bottom: user + settings + logout ───────────────── */}
      <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-4 space-y-0.5">
        {/* Settings */}
        {/* <button
          onClick={() => {}}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-150"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
          Settings
        </button> */}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-slate-500">logout</span>
          Log Out
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-3 pt-3 mt-1 border-t border-slate-50 dark:border-slate-800/50">
          {userAvatarUrl ? (
            <img
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              src={userAvatarUrl}
              alt={userName}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white dark:ring-slate-900"
              style={getAvatarBackground(userName)}
            >
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate leading-none">{userName}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate mt-0.5">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
