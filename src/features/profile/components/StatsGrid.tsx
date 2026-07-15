import { FileText, Package, AlertCircle, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import { usePatientProfileQuery } from '../hooks/useProfileQueries';

export default function StatsGrid() {
  const { data: profile, isLoading } = usePatientProfileQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-[#0f172a] p-5 border border-gray-200 dark:border-slate-800 flex items-center gap-4 rounded-2xl shadow-sm animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="h-6 w-8 bg-gray-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Overview</h3>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Requests Card */}
          <div className="bg-white dark:bg-[#0f172a] p-5 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#009ADA]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#009ADA] dark:text-sky-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Requests</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{profile?.totalPrescriptionRequests ?? 0}</p>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white dark:bg-[#0f172a] p-5 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{profile?.ordersCount ?? 0}</p>
            </div>
          </div>

          {/* Ratings Card */}
          <div className="bg-white dark:bg-[#0f172a] p-5 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Pharmacy Ratings</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{profile?.totalPharmacyRatings ?? 0}</p>
            </div>
          </div>

          {/* Complaints Card */}
          <div className="bg-white dark:bg-[#0f172a] p-5 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#BA1A1A]/10 dark:bg-red-500/10 flex items-center justify-center text-[#BA1A1A] dark:text-red-400 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Complaints</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{profile?.complaintsSubmitted ?? 0}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Orders Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Orders Breakdown</h3>
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Pending Orders */}
          <div className="bg-white dark:bg-[#0f172a] p-5 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-xl font-black text-gray-900 dark:text-white leading-none mt-1">{profile?.pendingOrders ?? 0}</p>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white dark:bg-[#0f172a] p-5 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
              <p className="text-xl font-black text-gray-900 dark:text-white leading-none mt-1">{profile?.completedOrders ?? 0}</p>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white dark:bg-[#0f172a] p-5 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Cancelled</p>
              <p className="text-xl font-black text-gray-900 dark:text-white leading-none mt-1">{profile?.cancelledOrders ?? 0}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
