import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function WelcomeHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'Sarah'}!
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Track your medications, compare pharmacy offers, and manage your health seamlessly.
        </p>
      </div>
      <Link
        to="/requests/new"
        className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-medium shrink-0"
      >
        <Plus className="w-5 h-5" />
        <span>New Request</span>
      </Link>
    </div>
  );
}
