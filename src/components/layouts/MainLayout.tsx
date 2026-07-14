import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { usePatientRealTimeUpdates } from '@/features/patient/hooks/usePatientRealTimeUpdates';

export default function MainLayout() {
  usePatientRealTimeUpdates();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('patient-theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('patient-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('patient-theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0f19] dark:text-[#f8fafc] transition-colors duration-300">
      <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
