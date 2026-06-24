import React from 'react';
import { NavLink } from 'react-router-dom';

interface PharmacySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PharmacySidebar: React.FC<PharmacySidebarProps> = ({ isOpen, onClose }) => {
  const navLinks = [
    { to: '/pharmacy/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/pharmacy/requests', icon: 'location_on', label: 'Nearby Requests' },
    { to: '/pharmacy/my-bids', icon: 'gavel', label: 'My Bids' },
    { to: '/pharmacy/orders', icon: 'inventory_2', label: 'Orders' },
    { to: '/pharmacy/profile', icon: 'settings', label: 'Profile Settings' },
  ];

  return (
    <aside 
      className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col pt-8 pb-8 h-full bg-surface-gray dark:bg-on-background border-r border-border-light dark:border-outline-variant w-sidebar-width shrink-0 overflow-y-auto fixed md:relative z-50`}
    >
      <div className="px-6 mb-8 mt-16 md:mt-0">
        <h2 className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider mb-1">PHARMACY MENU</h2>
        <p className="font-body-sm text-body-sm text-outline">Pharmacy Owner</p>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => { if (isOpen) onClose(); }}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 transition-all duration-200 ease-in-out ${
                isActive 
                  ? 'bg-primary-container/10 text-primary font-bold border-r-4 border-primary' 
                  : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-inverse-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {link.icon}
                </span>
                <span className="font-label-md text-label-md">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto px-4">
        <button className="w-full flex items-center gap-3 text-on-surface-variant dark:text-surface-variant px-4 py-3 hover:bg-surface-container dark:hover:bg-inverse-surface transition-all duration-200 ease-in-out rounded-lg">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </button>
      </div>
    </aside>
  );
};
