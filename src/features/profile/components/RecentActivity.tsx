import { History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentActivity() {
  return (
    <section>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
      <div className="bg-white border border-gray-200 p-12 text-center shadow-sm rounded-2xl">
        <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-base text-gray-500">No recent requests or orders to show.</p>
        <Link
          to="/requests/new"
          className="mt-4 inline-block text-[#009ADA] font-semibold text-sm hover:underline"
        >
          Start a new request
        </Link>
      </div>
    </section>
  );
}
