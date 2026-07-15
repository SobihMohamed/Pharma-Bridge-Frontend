import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { formatLocalDateTime } from "@/utils/formatTime";
import {
  useAdminPrescriptionRequestsQuery,
  useAllPatientsDropdownQuery,
  AdminPrescriptionRequestsParams,
} from "../hooks/useAdminPrescriptionRequestsQuery";
import { AdminPrescriptionRequestDto } from "../services/adminService";
import {
  Search,
  Calendar,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  Tag,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  User,
  Users,
} from "lucide-react";

// ---------- Constants ----------

const STATUS_TABS = [
  { label: "All Requests", value: "", color: "bg-slate-400" },
  { label: "Pending Review", value: "Pending", color: "bg-amber-500" },
  { label: "Has Bids", value: "HasBids", color: "bg-sky-500" },
  { label: "Closed", value: "Closed", color: "bg-emerald-500" },
  { label: "Cancelled", value: "Cancelled", color: "bg-rose-500" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  HasBids: "bg-sky-50 text-sky-700 border border-sky-200/50 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  Closed: "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  HasBids: "bg-sky-500",
  Closed: "bg-emerald-500",
  Cancelled: "bg-rose-500",
};

// Soft Pastel Colors for Avatars
const AVATAR_COLORS = [
  "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
  "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
];

function avatarClass(i: number): string {
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}

// ---------- Helpers ----------

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

const formatDateTime = (iso: string) => {
  if (!iso) return "—";
  return formatLocalDateTime(iso);
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
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
          {subtext}
        </p>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-14 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800" />
      <div className="divide-y divide-slate-150 dark:divide-slate-800">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex px-6 py-4 items-center justify-between space-x-4">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32 flex-1" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#0f172a] border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 bg-slate-50 dark:bg-[#0b0f19] rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500">
        <FileText className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No prescription requests found</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm mb-5">
        No requests match your current filter criteria. Try adjusting the filters or clearing them.
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
  FromDate: string;
  ToDate: string;
}

const INITIAL_FILTERS: FilterState = {
  Search: "",
  Status: "",
  FromDate: "",
  ToDate: "",
};

export default function PrescriptionRequestsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [pageIndex, setPageIndex] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const pageSize = 10;

  // Build query params from applied filters
  const queryParams: AdminPrescriptionRequestsParams = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    Search: appliedFilters.Search || undefined,
    Status: appliedFilters.Status || undefined,
    FromDate: appliedFilters.FromDate || undefined,
    ToDate: appliedFilters.ToDate || undefined,
  };

  const { data, isLoading, isError } = useAdminPrescriptionRequestsQuery(queryParams);
  const { data: patientsData } = useAllPatientsDropdownQuery();

  const requestsList: AdminPrescriptionRequestDto[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const patientOptions = patientsData?.data || [];

  // Calculate quick metrics from the active page list
  const pendingCount = requestsList.filter((r) => r.status === "Pending").length;
  const hasBidsCount = requestsList.filter((r) => r.status === "HasBids").length;
  const closedCount = requestsList.filter((r) => r.status === "Closed").length;

  // ---- Handlers ----

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "FromDate" && next.ToDate && next.ToDate < value) {
        next.ToDate = "";
      }
      return next;
    });
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
    <AdminLayout title="Prescription Requests">
      <div className="p-6 space-y-6 bg-[#F4F6FA] dark:bg-[#0b0f19] min-h-screen transition-colors duration-300">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Prescriptions</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              Verify, audit, and inspect prescription bids across the system.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 rounded-full px-3.5 py-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Requests Feed
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Requests"
            value={totalCount}
            icon={<FileText className="w-5 h-5" />}
            gradient="from-indigo-500 to-violet-600"
            subtext="Requests matching current parameters"
          />
          <StatCard
            label="Pending Review"
            value={pendingCount}
            icon={<Clock className="w-5 h-5" />}
            gradient="from-amber-500 to-orange-600"
            subtext="Awaiting bids or review"
          />
          <StatCard
            label="Active Offers"
            value={hasBidsCount}
            icon={<Tag className="w-5 h-5" />}
            gradient="from-sky-500 to-blue-600"
            subtext="Has bids from pharmacies"
          />
          <StatCard
            label="Closed Requests"
            value={closedCount}
            icon={<CheckCircle className="w-5 h-5" />}
            gradient="from-emerald-500 to-teal-600"
            subtext="Completed/Dispatched requests"
          />
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
          
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
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab.value !== "" && <span className={`w-2 h-2 rounded-full ${tab.color}`} />}
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start md:self-auto"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Advanced Filters
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Advanced Filters Expandable Drawer */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 animate-fadeIn">
              {/* Search */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    className="w-full h-10 bg-slate-50 dark:bg-[#0b0f19] border border-slate-250 dark:border-slate-700 rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-700 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-white"
                    placeholder="Patient phone, medicine,..."
                    type="text"
                    value={filters.Search}
                    onChange={(e) => handleFilterChange("Search", e.target.value)}
                  />
                </div>
              </div>

              {/* From Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">From Date</label>
                <input
                  className="w-full h-10 bg-slate-50 dark:bg-[#0b0f19] border border-slate-250 dark:border-slate-700 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-700 outline-none transition-all dark:text-white"
                  type="date"
                  min="2026-01-01"
                  value={filters.FromDate}
                  onChange={(e) => handleFilterChange("FromDate", e.target.value)}
                />
              </div>

              {/* To Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">To Date</label>
                <input
                  className="w-full h-10 bg-slate-50 dark:bg-[#0b0f19] border border-slate-250 dark:border-slate-700 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-700 outline-none transition-all dark:text-white"
                  type="date"
                  min={filters.FromDate || "2026-01-01"}
                  value={filters.ToDate}
                  onChange={(e) => handleFilterChange("ToDate", e.target.value)}
                />
              </div>

              {/* Action Buttons inside Drawer */}
              <div className="flex items-end gap-3 pb-0.5">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 h-10 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-750 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-500 dark:text-rose-400 mb-2" />
            <h4 className="text-lg font-bold">Failed to load prescription requests</h4>
            <p className="text-sm mt-1 text-rose-600 dark:text-rose-400/80">
              There was an issue communicating with the backend API. Please verify the endpoint is online.
            </p>
          </div>
        ) : requestsList.length === 0 ? (
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Patient Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Patient Phone
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Medicine Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Delivery Area
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                      Bids Count
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {requestsList.map((req, i) => {
                    const initials = getInitials(req.patientName);
                    return (
                      <tr
                        key={req.id}
                        onClick={() => navigate(`/admin/prescription-requests/${req.id}`)}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                      >
                        {/* Patient Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 border ${avatarClass(i)}`}
                            >
                              {initials}
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[14px]">
                              {req.patientName || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Patient Phone */}
                        <td className="px-6 py-4">
                          <span className="text-[14px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {req.patientPhone || "—"}
                          </span>
                        </td>

                        {/* Medicine Name — truncated with native tooltip */}
                        <td className="px-6 py-4 max-w-[200px]">
                          <span
                            className="font-bold text-slate-800 dark:text-slate-200 text-[14px] block truncate"
                            title={req.medicineName || undefined}
                          >
                            {req.medicineName || "—"}
                          </span>
                        </td>

                        {/* Delivery Area */}
                        <td className="px-6 py-4">
                          <span className="text-[14px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {req.deliveryArea || "—"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[req.status] || STATUS_STYLES.Pending}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[req.status] || STATUS_DOT.Pending}`} />
                            {req.status}
                          </span>
                        </td>

                        {/* Bids Count */}
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-black border ${
                            req.bidsCount > 0
                              ? "bg-sky-50 text-sky-600 border-sky-100 shadow-sm dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20"
                              : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/50 dark:text-slate-500 dark:border-slate-700"
                          }`}>
                            {req.bidsCount}
                          </span>
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4">
                          <span className="text-[13px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {formatDateTime(req.createdAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/prescription-requests/${req.id}`);
                            }}
                            className="px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{(pageIndex - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {Math.min(pageIndex * pageSize, totalCount)}
                </span>{" "}
                of <span className="font-semibold text-slate-700 dark:text-slate-300">{totalCount.toLocaleString()}</span> requests
              </span>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={pageIndex === 1}
                    onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-[#0f172a] disabled:text-slate-350 dark:disabled:text-slate-600 transition-all shadow-sm dark:text-slate-300"
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
                            ? "bg-slate-900 dark:bg-slate-700 text-white shadow-sm"
                            : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={pageIndex >= totalPages}
                    onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-[#0f172a] disabled:text-slate-350 dark:disabled:text-slate-600 transition-all shadow-sm dark:text-slate-300"
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
