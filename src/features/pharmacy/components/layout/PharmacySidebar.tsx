import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Radio, Gavel, Package, Settings, LogOut, Lock, AlertTriangle, Plus, ChevronLeft, ChevronRight, ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { usePharmaOwnerProfileQuery } from '../../hooks/useOwnerProfile';
import { useMyPharmacyProfileQuery } from '../../hooks/usePharmacyProfile';

interface PharmacySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  /** Fires whenever the collapsed state changes, so the parent layout
   *  can shift the main content's left margin (e.g. `ml-64` <-> `ml-20`). */
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const COLLAPSE_STORAGE_KEY = 'pharmacy-sidebar-collapsed';

const palette = {
  base: '#FFFFFF',
  line: '#E7EFEE',
  teal: '#0E8E85',
  tealSoft: '#E3F5F2',
  tealDeep: '#0B6E67',
  mint: '#2FBFA0',
  mintSoft: '#EAFBF5',
  warn: '#D97706',
  warnSoft: '#FFF6E8',
  warnLine: '#FBE3B8',
  textPrimary: '#12302D',
  textMuted: '#5C7A76',
  textFaint: '#9FB8B4',
};

function HeartbeatLine() {
  return (
    <svg width="52" height="20" viewBox="0 0 52 20" fill="none" className="shrink-0">
      <path
        d="M0 10 H14 L18 3 L23 17 L27 10 H33 L36 5 L39 15 L42 10 H52"
        stroke="#0284c7"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: 'draw-beat 2.2s ease-in-out infinite',
        }}
      />
    </svg>
  );
}

export const PharmacySidebar: React.FC<PharmacySidebarProps> = ({ isOpen, onClose, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1';
  });

  useEffect(() => {
    onCollapseChange?.(isCollapsed);
    window.localStorage.setItem(COLLAPSE_STORAGE_KEY, isCollapsed ? '1' : '0');
  }, [isCollapsed]);

  const clearAuth = useAuthStore(state => state.clearAuth);
  const { data: ownerProfile, isLoading: isOwnerLoading } = usePharmaOwnerProfileQuery();
  const isOwnerApproved = ownerProfile?.status === 'Approved';
  const { data: pharmacyProfile, isLoading: isPharmacyLoading } = useMyPharmacyProfileQuery(isOwnerApproved);

  const isLoading = isOwnerLoading || isPharmacyLoading;

  const isOwnerMissing = !isLoading && !ownerProfile;
  const isOwnerPending = !isLoading && ownerProfile?.status === 'Pending';
  const actualPharmacyProfile = (pharmacyProfile as any)?.data || pharmacyProfile;
  const isPharmacyApproved = actualPharmacyProfile?.status === 'Approved' || actualPharmacyProfile?.status === 'Active' || actualPharmacyProfile?.isApproved;

  const isLocked = !isLoading && !(isOwnerApproved && isPharmacyApproved);

  const navLinks = [
    { to: '/pharmacy/dashboard', icon: LayoutDashboard, label: 'Dashboard', restricted: true },
    { to: '/pharmacy/radar', icon: Radio, label: 'Live Radar', restricted: true, live: true },
    { to: '/pharmacy/requests', icon: ClipboardList, label: 'All Requests', restricted: true },
    { to: '/pharmacy/bids', icon: Gavel, label: 'My Bids', restricted: true },
    { to: '/pharmacy/orders', icon: Package, label: 'Active Orders', restricted: true },
    { to: '/pharmacy/settings', icon: Settings, label: 'Settings / Account', restricted: false },
  ];

  return (
    <aside
      className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-all duration-300 ease-in-out
        fixed top-0 left-0 h-screen flex flex-col z-50
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-white border-r border-gray-200 dark:bg-[#0f172a] dark:border-slate-800
      `}
    >
      <style>{`
        @keyframes draw-beat {
          0% { stroke-dashoffset: 1; }
          45% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        .pb-scroll::-webkit-scrollbar { width: 5px; }
        .pb-scroll::-webkit-scrollbar-thumb { background: #DCEBE9; border-radius: 8px; }
        .pb-tooltip {
          position: absolute; left: calc(100% + 10px); top: 50%; transform: translateY(-50%);
          background: #1e293b; color: #fff; font-size: 12px; font-weight: 600;
          padding: 5px 10px; border-radius: 8px; white-space: nowrap; pointer-events: none;
          opacity: 0; transition: opacity 0.15s ease; z-index: 60;
        }
        .pb-navitem:hover .pb-tooltip { opacity: 1; }
      `}</style>

      {/* Collapse / expand handle */}
      <button
        onClick={() => setIsCollapsed(v => !v)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-12 rounded-full items-center justify-center shadow-sm z-10 transition-all bg-white border border-gray-200 text-gray-400 hover:text-teal-650 hover:bg-teal-50 dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-teal-400"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand Area */}
      <div
        className={`h-16 flex items-center shrink-0 border-b border-gray-200 dark:border-slate-800 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)' }}
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-extrabold tracking-tight whitespace-nowrap text-gray-900 dark:text-white">
              Pharma<span className="text-teal-600 dark:text-teal-400">Bridge</span>
            </h1>
          )}
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className={`flex-1 overflow-y-auto pb-scroll py-6 flex flex-col gap-1.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {/* Status Badge */}
        <div className={`mb-4 ${isCollapsed ? 'px-0 flex justify-center' : 'px-3'}`}>
          {isLocked ? (
            <div
              className={`relative group flex items-center rounded-2xl ${isCollapsed ? 'w-10 h-10 justify-center' : 'gap-3 p-3'} bg-amber-50/50 border border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/30`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-amber-100 dark:bg-amber-900/30"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-500">
                    {isOwnerMissing ? 'Registration Incomplete' : isOwnerPending ? 'Status: Under Review' : 'Pharmacy Setup Required'}
                  </span>
                  <span className="text-[10px] font-medium text-amber-600/80 dark:text-amber-500/70">
                    {isOwnerMissing ? 'Complete your profile details' : isOwnerPending ? 'Under Review' : 'Add Pharmacy Details'}
                  </span>
                </div>
              )}
              {isCollapsed && (
                <span className="pb-tooltip">
                  {isOwnerMissing ? 'Registration Incomplete' : isOwnerPending ? 'Under Review' : 'Setup Required'}
                </span>
              )}
            </div>
          ) : (
            <div
              className={`relative group flex items-center rounded-2xl ${
                isCollapsed
                  ? 'w-10 h-10 justify-center bg-sky-50 border border-sky-200'
                  : 'gap-3 p-3 bg-sky-50 border border-sky-200'
              } dark:bg-sky-950/10 dark:border-sky-900/30`}
            >
              {isCollapsed ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 bg-sky-400 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                </span>
              ) : (
                <>
                  <HeartbeatLine />
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-bold text-[#0284c7] dark:text-sky-400">
                      Online &amp; Active
                    </span>

                    <span className="text-[10px] font-medium text-[#0284c7] dark:text-sky-300">
                      Ready to receive orders
                    </span>
                  </div>
                </>
              )}

              {isCollapsed && <span className="pb-tooltip">Online &amp; Active</span>}
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="px-3 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">Menu</p>
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isItemLocked = isLocked && link.restricted;

            if (isItemLocked) {
              return (
                <div
                  key={link.to}
                  className={`pb-navitem relative group flex items-center rounded-xl text-sm font-medium cursor-not-allowed text-gray-300 dark:text-slate-600 ${isCollapsed ? 'justify-center py-2.5' : 'gap-3 px-3.5 py-2.5'}`}
                >
                  <link.icon className="w-[18px] h-[18px] shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{link.label}</span>
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                    </>
                  )}
                  {isCollapsed && <span className="pb-tooltip">{link.label}</span>}
                </div>
              );
            }

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => { if (isOpen) onClose(); }}
                className={({ isActive }) => `
                  pb-navitem relative group flex items-center rounded-xl text-sm font-medium transition-colors duration-150 
                  ${isCollapsed ? 'justify-center py-2.5' : 'gap-3 px-3.5 py-2.5'} 
                  ${isActive 
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400 font-bold' 
                    : 'text-gray-500 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-100'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white shadow-sm dark:bg-slate-800' : 'bg-transparent'}`}
                    >
                      <link.icon className="w-4 h-4" />
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{link.label}</span>
                        {link.live && (
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-500 animate-pulse shadow-[0_0_0_3px_rgba(16,185,129,0.2)]"
                          />
                        )}
                      </>
                    )}
                    {isCollapsed && <span className="pb-tooltip">{link.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-4 shrink-0 border-t border-gray-200 dark:border-slate-800">
        <button
          onClick={() => {
            clearAuth();
            if (isOpen) onClose();
          }}
          className={`pb-navitem relative group w-full flex items-center text-sm font-medium rounded-xl transition-colors ${isCollapsed ? 'justify-center py-2.5' : 'gap-3 px-3.5 py-2.5'} text-gray-500 hover:bg-red-50 hover:text-red-650 dark:text-slate-400 dark:hover:bg-red-950/10 dark:hover:text-red-400`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && <span className="pb-tooltip">Logout</span>}
        </button>
      </div>
    </aside>
  );
};