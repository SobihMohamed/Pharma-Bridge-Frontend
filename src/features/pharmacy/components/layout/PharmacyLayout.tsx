import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PharmacyTopNav } from './PharmacyTopNav';
import { PharmacySidebar } from './PharmacySidebar';
import { usePharmacyRealTimeUpdates } from '../../hooks/usePharmacyRealTimeUpdates';

export const PharmacyLayout: React.FC = () => {
  usePharmacyRealTimeUpdates(); // Global SignalR listener for the entire Pharmacy Dashboard
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <PharmacySidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Fixed TopNav (left aligned to sidebar edge on desktop) */}
        <PharmacyTopNav onMenuToggle={toggleMobileMenu} />
        
        {/* Scrollable Main View */}
        <main className="flex-1 w-full pt-16 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
