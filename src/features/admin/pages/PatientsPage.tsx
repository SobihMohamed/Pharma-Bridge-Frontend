import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminPatientsQuery } from "../hooks/useAdminPatientsQuery";
import { PatientProfileDto } from "@/features/profile/types";

const AVATAR_BG = [
  "bg-primary/10 text-primary border border-primary/20",
  "bg-indigo-50 text-indigo-700 border border-indigo-150",
  "bg-sky-50 text-sky-700 border border-sky-150",
  "bg-violet-50 text-violet-700 border border-violet-150",
  "bg-secondary-fixed text-on-secondary-fixed border border-outline-variant",
];

const getInitials = (name: string) => {
  if (!name) return "P";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getPaginationRange = (current: number, total: number) => {
  const range: (number | string)[] = [];
  const delta = 1;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }
  return range;
};

function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  trendType = "neutral",
}: {
  title: string;
  value: string | number;
  icon: string;
  description: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
}) {
  const trendColor = {
    positive: "text-primary bg-primary/10 border-primary/25",
    negative: "text-rose-600 bg-rose-50 border-rose-100",
    neutral: "text-slate-600 bg-slate-50 border-slate-100",
  }[trendType];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:border-primary/30">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-slate-400 font-label-md text-[11px] uppercase tracking-wider font-semibold">
            {title}
          </span>
          <h4 className="text-2xl font-bold font-display-sm text-slate-800 tracking-tight">
            {value}
          </h4>
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {trend && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${trendColor}`}>
            {trend}
          </span>
        )}
        <span className="text-slate-400 text-[13px]">{description}</span>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-slate-100 rounded w-1/2" />
          <div className="h-7 bg-slate-200 rounded w-1/3" />
        </div>
        <div className="w-10 h-10 rounded-lg bg-slate-100" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-4 bg-slate-100 rounded w-12" />
        <div className="h-3 bg-slate-100 rounded w-24" />
      </div>
    </div>
  );
}

function StatsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-12 bg-slate-50 border-b border-slate-200/80" />
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex px-6 py-4 items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-9 h-9 bg-slate-100 rounded-full" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
            </div>
            <div className="h-4 bg-slate-100 rounded w-1/3 flex-1" />
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-4 bg-slate-100 rounded w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-350 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 text-slate-400">
        <span className="material-symbols-outlined text-[32px]">person_off</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">No patients found</h3>
      <p className="text-slate-550 text-sm max-w-sm mb-5">
        We couldn't find any patient profile matching your search query. Try clearing the filter or adjusting terms.
      </p>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-label-md text-label-md rounded-lg border border-slate-200 transition-colors"
      >
        Clear Search Filter
      </button>
    </div>
  );
}

export default function PatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // Debounce search input to limit API calls (around 600 ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(1); // Reset to page 1 on new search
    }, 600);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch paginated patient data using custom query hook
  const { data, isLoading, isError } = useAdminPatientsQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
    Search: debouncedSearch || undefined,
  });

  const patientsList: PatientProfileDto[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const withComplaintsCount = patientsList.filter((patient) => (patient.complaintsSubmitted || 0) > 0).length;
  const totalPrescriptionRequests = patientsList.reduce(
    (sum, patient) => sum + (patient.totalPrescriptionRequests || 0),
    0,
  );
  const totalOrders = patientsList.reduce((sum, patient) => sum + (patient.ordersCount || 0), 0);
  const totalComplaints = patientsList.reduce(
    (sum, patient) => sum + (patient.complaintsSubmitted || 0),
    0,
  );

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-8 bg-[#F8FAFC]">
        {/* Screen Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Patient Directory</h3>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage, monitor and audit patient records across the distribution network.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Input Box */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-10 font-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                placeholder="Search by Name, Phone, Email..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition-colors p-0.5 rounded-full hover:bg-slate-100 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bento Grid Stats */}
        {isLoading ? (
          <StatsSkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Patients"
              value={totalCount.toLocaleString()}
              icon="group"
              description="Registered network profiles"
              trend="+12%"
              trendType="positive"
            />
            <StatCard
              title="With Complaints"
              value={withComplaintsCount.toLocaleString()}
              icon="report"
              description="Profiles that submitted complaints"
              trend={`${totalCount ? Math.round((withComplaintsCount / totalCount) * 100) : 0}%`}
              trendType="negative"
            />
            <StatCard
              title="Prescription Requests"
              value={totalPrescriptionRequests.toLocaleString()}
              icon="description"
              description="Requests submitted by patients"
              trend="Active"
              trendType="neutral"
            />
            <StatCard
              title="Orders"
              value={totalOrders.toLocaleString()}
              icon="shopping_cart"
              description="Total orders placed by patients"
              trend="Active"
              trendType="neutral"
            />
          </div>
        )}

        {/* DataTable Container */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="bg-rose-50 text-rose-750 border border-rose-200/50 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px] mb-2 text-rose-500">warning</span>
            <h4 className="text-lg font-bold">Failed to load patient records</h4>
            <p className="text-sm mt-1 text-rose-600">
              There was an issue communicating with the backend Patient API. Please verify the endpoint is online.
            </p>
          </div>
        ) : patientsList.length === 0 ? (
          <EmptyState onClear={handleClearSearch} />
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80">
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Patient Details
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientsList.map((patient, i) => {
                    const initials = getInitials(patient.fullName);
                    return (
                      <tr
                        key={patient.id}
                        onClick={() => navigate(`/admin/patients/${(patient as any).applicationUserId || patient.id}`)}
                        className="hover:bg-slate-55/50 transition-colors cursor-pointer group"
                      >
                        {/* Profile Block */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_BG[i % AVATAR_BG.length]}`}
                            >
                              {initials}
                            </div>
                            <span className="font-semibold text-slate-800 text-[14px]">
                              {patient.fullName}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <span className="text-[14px] text-slate-700">
                            {patient.email}
                          </span>
                        </td>

                        {/* Phone Number */}
                        <td className="px-6 py-4">
                          <span className="text-[14px] text-slate-700">
                            {patient.phoneNumber || "—"}
                          </span>
                        </td>

                        {/* Actions button */}
                        <td className="px-6 py-4 text-right">
                          <button className="material-symbols-outlined text-slate-400 hover:text-slate-600 transition-colors text-[20px] p-1 rounded-md hover:bg-slate-100">
                            more_vert
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[13px] text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{(pageIndex - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(pageIndex * pageSize, totalCount)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-700">{totalCount.toLocaleString()}</span> patients
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={pageIndex === 1}
                    onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-slate-750 disabled:opacity-50 disabled:hover:bg-transparent disabled:text-slate-300 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>

                  {getPaginationRange(pageIndex, totalPages).map((p, index) => {
                    if (p === "...") {
                      return (
                        <span key={`dots-${index}`} className="px-2 text-slate-400 text-sm">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={`page-${p}`}
                        onClick={() => setPageIndex(Number(p))}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-all ${
                          pageIndex === p
                            ? "bg-primary text-white shadow-sm"
                            : "border border-slate-200 hover:bg-slate-100 text-slate-650 hover:text-slate-750"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={pageIndex >= totalPages}
                    onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-slate-750 disabled:opacity-50 disabled:hover:bg-transparent disabled:text-slate-300 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
