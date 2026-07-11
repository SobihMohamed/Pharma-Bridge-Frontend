import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PharmacyTopNav } from './PharmacyTopNav';
import { PharmacySidebar } from './PharmacySidebar';
import { usePharmacyRealTimeUpdates } from '../../hooks/usePharmacyRealTimeUpdates';
import { PharmacyProtectedRoute } from './PharmacyProtectedRoute';

export const PharmacyLayout: React.FC = () => {
  usePharmacyRealTimeUpdates(); // Global SignalR listener for the entire Pharmacy Dashboard
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        onCollapseChange={setIsSidebarCollapsed}
      />
      
      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className={`min-h-screen flex flex-col transition-[margin] duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Fixed TopNav (left aligned to sidebar edge on desktop) */}
        <PharmacyTopNav onMenuToggle={toggleMobileMenu} isSidebarCollapsed={isSidebarCollapsed} />
        
        {/* Scrollable Main View */}
        <main className="flex-1 w-full p-4 md:p-8" style={{ paddingTop: '80px' }}>
          <div className="max-w-6xl mx-auto">
            <PharmacyProtectedRoute>
              <Outlet />
            </PharmacyProtectedRoute>
          </div>
        </main>
      </div>
    </div>
  );
};