import { FileText, Package, AlertCircle } from 'lucide-react';
import { usePatientProfileQuery } from '../hooks/useProfileQueries';

export default function StatsGrid() {
  const { data: profile, isLoading } = usePatientProfileQuery();

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#0f172a] p-6 border border-gray-200 dark:border-slate-800 flex items-center gap-4 rounded-2xl shadow-sm animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Requests Card */}
      <div className="bg-white dark:bg-[#0f172a] p-6 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
        <div className="w-14 h-14 rounded-2xl bg-[#009ADA]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#009ADA] dark:text-sky-400 shrink-0">
          <FileText className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Requests</p>
          <p className="text-3xl font-bold text-[#009ADA] dark:text-sky-400 leading-none mt-1">{profile?.totalPrescriptionRequests ?? 0}</p>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-white dark:bg-[#0f172a] p-6 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
        <div className="w-14 h-14 rounded-2xl bg-[#006591]/10 dark:bg-sky-600/20 flex items-center justify-center text-[#006591] dark:text-sky-300 shrink-0">
          <Package className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Orders</p>
          <p className="text-3xl font-bold text-[#006591] dark:text-sky-300 leading-none mt-1">{profile?.ordersCount ?? 0}</p>
        </div>
      </div>

      {/* Complaints Card */}
      <div className="bg-white dark:bg-[#0f172a] p-6 border border-gray-200 dark:border-slate-800 flex items-center gap-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
        <div className="w-14 h-14 rounded-2xl bg-[#BA1A1A]/10 dark:bg-red-500/10 flex items-center justify-center text-[#BA1A1A] dark:text-red-400 shrink-0">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Complaints</p>
          <p className="text-3xl font-bold text-[#BA1A1A] dark:text-red-400 leading-none mt-1">{profile?.complaintsSubmitted ?? 0}</p>
        </div>
      </div>
    </section>
  );
}
