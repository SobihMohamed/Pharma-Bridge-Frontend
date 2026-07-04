import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, Radio, Gavel, Package, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';

interface PharmacySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PharmacySidebar: React.FC<PharmacySidebarProps> = ({ isOpen, onClose }) => {
  const clearAuth = useAuthStore(state => state.clearAuth);

  const navLinks = [
    { to: '/pharmacy/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/pharmacy/radar', icon: Radio, label: 'Live Radar' },
    { to: '/pharmacy/bids', icon: Gavel, label: 'My Bids' },
    { to: '/pharmacy/orders', icon: Package, label: 'Active Orders' },
    { to: '/pharmacy/settings', icon: Settings, label: 'Settings / Account' },
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
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
        </div>
        
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
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
          ))}
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
