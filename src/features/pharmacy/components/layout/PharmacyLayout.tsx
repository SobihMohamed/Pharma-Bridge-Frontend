import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PharmacyTopNav } from './PharmacyTopNav';
import { PharmacySidebar } from './PharmacySidebar';

export const PharmacyLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-surface-gray min-h-screen text-on-surface font-body-md">
      <PharmacyTopNav onMenuToggle={toggleMobileMenu} />
      
      <div className="flex max-w-container-max mx-auto w-full pt-16 h-screen overflow-hidden">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <PharmacySidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
        
        <main className="flex-1 bg-surface-gray overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
