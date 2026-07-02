import { Outlet } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { usePatientRealTimeUpdates } from '@/features/patient/hooks/usePatientRealTimeUpdates';

export default function MainLayout() {
  usePatientRealTimeUpdates();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
