import React from 'react';

interface PharmacyTopNavProps {
  onMenuToggle: () => void;
}

export const PharmacyTopNav: React.FC<PharmacyTopNavProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-surface dark:bg-on-background border-b border-border-light dark:border-outline-variant w-full fixed top-0 z-50">
      <div className="flex justify-between items-center h-16 px-6 w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-4">
          <button 
            aria-label="Menu" 
            onClick={onMenuToggle}
            className="md:hidden text-on-surface-variant hover:bg-surface-gray dark:hover:bg-inverse-surface p-2 rounded transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-display-lg text-display-lg font-black text-primary tracking-tight">PHARMABRIDGE</h1>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="notifications" className="text-on-surface-variant dark:text-surface-variant hover:bg-surface-gray dark:hover:bg-inverse-surface p-2 rounded-full transition-colors opacity-80 duration-150">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-gray dark:hover:bg-inverse-surface p-1 pr-3 rounded-full transition-colors">
            <img 
              alt="User profile photo of Sarah Jenkins"
              className="w-8 h-8 rounded-full object-cover border border-border-light" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGSxQVXkm-OmqB6nWI4WaWg_psuyrhPbO3Cm0m4C6g9OqwxkiAgqwFMN6pEmYOY3aSoPa218UdjE1P3u_EMdB27erCnTWHendm1dxkFZHq6X-Ybgbi2W84ySCe9EGXbNB20dQGBj4Z_h9lJDsJSFFg1XNTk6oVNJvMlE5nQfUrReaInV7lbifsOb3miXFuKgsdX6kL3wNK94jfL2Uv2sahmhSNg_P3ICXlSkJ17E1dDElEveWQOVrW767M9yjXevj8TAqkece1iJA"
            />
            <span className="font-label-md text-label-md text-on-surface font-medium hidden sm:block">
              Sarah Jenkins
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
