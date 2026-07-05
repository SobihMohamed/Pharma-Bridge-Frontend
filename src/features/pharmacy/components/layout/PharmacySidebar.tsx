import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Gavel, Package, Settings, LogOut, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { usePharmaOwnerProfileQuery } from '../../hooks/useOwnerProfile';
import { useMyPharmacyProfileQuery } from '../../hooks/usePharmacyProfile';

interface PharmacySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PharmacySidebar: React.FC<PharmacySidebarProps> = ({ isOpen, onClose }) => {
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
    { to: '/pharmacy/radar', icon: Radio, label: 'Live Radar', restricted: true },
    { to: '/pharmacy/requests', icon: Radio, label: 'All Requests', restricted: true },
    { to: '/pharmacy/bids', icon: Gavel, label: 'My Bids', restricted: true },
    { to: '/pharmacy/orders', icon: Package, label: 'Active Orders', restricted: true },
    { to: '/pharmacy/settings', icon: Settings, label: 'Settings / Account', restricted: false },
  ];

  return (
    <aside 
      className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 flex flex-col shadow-sm
      `}
    >
      {/* Brand Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <h1 className="text-xl font-black tracking-tight text-teal-600">
          PHARMABRIDGE
        </h1>
      </div>
      
      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1.5 px-3">
        {/* Status Badge */}
        <div className="px-3 mb-4">
          {isLocked ? (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-amber-800">
                  {isOwnerMissing ? 'Registration Incomplete' : isOwnerPending ? 'Status: Under Review' : 'Pharmacy Setup Required'}
                </span>
                <span className="text-[10px] font-medium text-amber-600">
                  {isOwnerMissing ? 'استكمل بياناتك' : isOwnerPending ? 'قيد المراجعة' : 'أضف بيانات الصيدلية'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-800">
                  Online & Active
                </span>
                <span className="text-[10px] font-medium text-emerald-600">
                  مستعد لاستقبال الطلبات
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
        </div>
        
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isItemLocked = isLocked && link.restricted;

            if (isItemLocked) {
              return (
                <div
                  key={link.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 opacity-60 grayscale cursor-not-allowed border-l-4 border-transparent"
                >
                  <link.icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1">{link.label}</span>
                  <Lock className="w-4 h-4 shrink-0 text-gray-300" />
                </div>
              );
            }

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => { if (isOpen) onClose(); }}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600 pl-2' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`
                }
              >
                <link.icon className="w-5 h-5 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      {/* Footer Area */}
      <div className="p-4 border-t border-gray-100 shrink-0">
        <button 
          onClick={() => {
            clearAuth();
            if (isOpen) onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
