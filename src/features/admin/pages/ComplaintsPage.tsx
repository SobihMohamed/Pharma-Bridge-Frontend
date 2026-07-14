import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import {
  useAdminComplaintsQuery,
  useAllPharmaciesDropdownQuery,
  AdminComplaintsParams,
} from "../hooks/useAdminComplaintsQuery";
import { PlatformComplaintDto } from "../services/adminService";
import {
  Search,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  Clock,
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  AlertOctagon,
  Calendar
} from "lucide-react";

// ---------- Constants ----------

const STATUS_TABS = [
  { label: "All Complaints", value: "", color: "bg-slate-400 dark:bg-slate-500" },
  { label: "Pending", value: "Pending", color: "bg-amber-500" },
  { label: "In Progress", value: "InProgress", color: "bg-sky-500" },
  { label: "Resolved", value: "Resolved", color: "bg-emerald-500" },
  { label: "Closed", value: "Closed", color: "bg-slate-500" },
  { label: "Rejected", value: "Rejected", color: "bg-rose-500" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20",
  InProgress: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200/50 dark:border-sky-500/20",
  Resolved: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20",
  Closed: "bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-300/50 dark:border-slate-500/20",
  Rejected: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  InProgress: "bg-sky-500",
  Resolved: "bg-emerald-500",
  Closed: "bg-slate-500",
  Rejected: "bg-rose-500",
};

// ---------- Helpers ----------

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

const formatDateTime = (iso: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

// ---------- Sub-components ----------

function StatCard({
  label,
  value,
  icon,
  gradient,
  subtext,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight tabular-nums">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      {subtext && (
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-3.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
          {subtext}
        </p>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-14 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800" />
      <div className="divide-y divide-slate-150 dark:divide-slate-800">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex px-6 py-4 items-center justify-between space-x-4">
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/4" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/5" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-16" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-20" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-24" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#0f172a] border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm transition-colors duration-300">
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No complaints found</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm mb-5">
        No platform complaints match your filter criteria. Try adjusting or clearing the filters.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
      >
        Clear All Filters
      </button>
    </div>
  );
}

// ---------- Filter state shape ----------

interface FilterState {
  Search: string;
  Status: string;
  PharmacyId: string;
}

const INITIAL_FILTERS: FilterState = {
  Search: "",
  Status: "",
  PharmacyId: "",
};

export default function ComplaintsPage() {
  const navigate = useNavigate();

  // Filter form state (not yet applied)
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Applied filters (sent to API)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTERS);

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // Build query params from applied filters
  const queryParams: AdminComplaintsParams = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    Search: appliedFilters.Search || undefined,
    Status: appliedFilters.Status || undefined,
    PharmacyId: appliedFilters.PharmacyId || undefined,
  };

  const { data, isLoading, isError } = useAdminComplaintsQuery(queryParams);
  const { data: pharmaciesData } = useAllPharmaciesDropdownQuery();

  const complaintsList: PlatformComplaintDto[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const pharmacyOptions = pharmaciesData?.data || [];

  // Quick stats calculations
  const pendingCount = complaintsList.filter((c) => c.status === "Pending").length;
  const inProgressCount = complaintsList.filter((c) => c.status === "InProgress").length;
  const resolvedCount = complaintsList.filter((c) => c.status === "Resolved").length;

  // ---- Handlers ----

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusTabChange = (statusVal: string) => {
    setFilters((prev) => ({ ...prev, Status: statusVal }));
    setAppliedFilters((prev) => ({ ...prev, Status: statusVal }));
    setPageIndex(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setPageIndex(1);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setPageIndex(1);
  };

  const hasActiveFilters = Object.values(appliedFilters).some((v) => v !== "");

  return (
    <AdminLayout title="Complaints Management">
      <div className="p-6 space-y-6 bg-[#F4F6FA] dark:bg-[#0b0f19] min-h-screen transition-colors duration-300">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Complaints</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              Monitor, track and manage platform complaints raised by users.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-500/10 border border-sky-200/50 dark:border-sky-500/20 rounded-full px-3.5 py-1.5 shadow-sm self-start sm:self-auto transition-colors duration-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            Live Support Feed
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Complaints"
            value={totalCount}
            icon={<FileText className="w-5 h-5" />}
            gradient="from-indigo-500 to-violet-600"
            subtext="All matching complaints"
          />
          <StatCard
            label="Pending Review"
            value={pendingCount}
            icon={<Clock className="w-5 h-5" />}
            gradient="from-amber-500 to-orange-600"
            subtext="Needs attention immediately"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            icon={<SlidersHorizontal className="w-5 h-5" />}
            gradient="from-sky-400 to-blue-600"
            subtext="Currently being handled"
          />
          <StatCard
            label="Resolved"
            value={resolvedCount}
            icon={<CheckCircle className="w-5 h-5" />}
            gradient="from-emerald-500 to-teal-600"
            subtext="Successfully closed cases"
          />
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 transition-colors duration-300">
          {/* Status Tabs Navigation */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl gap-1">
              {STATUS_TABS.map((tab) => {
                const isActive = appliedFilters.Status === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusTabChange(tab.value)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "bg-slate-900 dark:bg-slate-700 text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {tab.value !== "" && <span className={`w-2 h-2 rounded-full ${tab.color}`} />}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-750 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm transition-colors duration-300">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-500 mb-2" />
            <h4 className="text-lg font-bold">Failed to load platform complaints</h4>
            <p className="text-sm mt-1 text-rose-600 dark:text-rose-500">
              There was an issue communicating with the complaints backend API. Please verify the endpoint is online.
            </p>
          </div>
        ) : complaintsList.length === 0 ? (
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Title
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Submitted By
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Resolved At
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {complaintsList.map((complaint) => (
                    <tr
                      key={complaint.id}
                      onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group h-[52px]"
                    >
                      {/* Title */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-[14px]">
                          {complaint.title || "—"}
                        </span>
                      </td>

                      {/* Submitted By */}
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{complaint.submittedByName || "—"}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[complaint.status] || STATUS_STYLES.Pending}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[complaint.status] || STATUS_DOT.Pending}`} />
                          {complaint.status}
                        </span>
                      </td>

                      {/* Order ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-sky-600 dark:text-sky-400 font-bold">
                          {complaint.orderId ? `#${complaint.orderId}` : "—"}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          {formatDateTime(complaint.createdAt)}
                        </span>
                      </td>

                      {/* Resolved At */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                          {complaint.resolvedAt ? (
                           <>
                              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                              {formatDateTime(complaint.resolvedAt)}
                            </>
                          ) : (
                            "—"
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/complaints/${complaint.id}`);
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{(pageIndex - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {Math.min(pageIndex * pageSize, totalCount)}
                </span>{" "}
                of <span className="font-semibold text-slate-700 dark:text-slate-300">{totalCount.toLocaleString()}</span> complaints
              </span>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={pageIndex === 1}
                    onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 disabled:text-slate-350 transition-all shadow-sm text-slate-600 dark:text-slate-400"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPaginationRange(pageIndex, totalPages).map((p, index) => {
                    if (p === "...") {
                      return (
                        <span key={`dots-${index}`} className="px-2 text-slate-400 dark:text-slate-500 text-sm font-bold">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={`page-${p}`}
                        onClick={() => setPageIndex(Number(p))}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          pageIndex === p
                            ? "bg-slate-900 dark:bg-slate-600 text-white shadow-sm"
                            : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={pageIndex >= totalPages}
                    onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 disabled:text-slate-350 transition-all shadow-sm text-slate-600 dark:text-slate-400"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
