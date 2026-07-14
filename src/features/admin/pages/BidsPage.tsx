import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminBidsQuery, AdminBidsParams } from "../hooks/useAdminBidsQuery";
import { AdminBidListItemDto } from "../services/adminService";
import {
  Search,
  Calendar,
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
  Filter,
  X,
} from "lucide-react";

// ---------- Constants ----------

const STATUS_TABS = [
  { label: "All Bids", value: "", color: "bg-slate-400" },
  { label: "Pending", value: "Pending", color: "bg-amber-500" },
  { label: "Accepted", value: "Accepted", color: "bg-emerald-500" },
  { label: "Rejected", value: "Rejected", color: "bg-rose-500" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  Accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  Expired: "bg-slate-100 text-slate-600 border border-slate-300/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  Cancelled: "bg-slate-50 text-slate-700 border border-slate-300/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  Accepted: "bg-emerald-500",
  Rejected: "bg-rose-500",
  Expired: "bg-slate-400",
  Cancelled: "bg-slate-500",
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

const formatDateTime = (iso: string | null | undefined) => {
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
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-28 flex-1" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
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
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No bids found</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm mb-5">
        No bids match your current filter criteria. Try adjusting the filters or clearing them.
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

export default function BidsPage() {
  const navigate = useNavigate();

  // Filter form state (not yet applied)
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Applied filters (sent to API)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [pageIndex, setPageIndex] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const pageSize = 10;

  // Build query params from applied filters
  const queryParams: AdminBidsParams = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    Search: appliedFilters.Search || undefined,
    Status: appliedFilters.Status || undefined,
    FromDate: appliedFilters.FromDate || undefined,
    ToDate: appliedFilters.ToDate || undefined,
  };

  const { data, isLoading, isError, error } = useAdminBidsQuery(queryParams);

  const bidsList: AdminBidListItemDto[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Quick stats calculations
  const pendingCount = bidsList.filter((b) => b.status === "Pending").length;
  const acceptedCount = bidsList.filter((b) => b.status === "Accepted").length;
  const failedCount = bidsList.filter((b) => ["Rejected", "Expired", "Cancelled"].includes(b.status)).length;

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
    <AdminLayout title="Bids Management">
      <div className="p-6 space-y-6 bg-[#F4F6FA] dark:bg-[#0b0f19] min-h-screen transition-colors duration-300">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Bids</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              Browse, filter and review all pharmacy bids submitted for prescription requests.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-500/10 border border-sky-200/50 dark:border-sky-500/20 rounded-full px-3.5 py-1.5 shadow-sm self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            Live Bids Feed
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Bids"
            value={totalCount}
            icon={<FileText className="w-5 h-5" />}
            gradient="from-indigo-500 to-violet-600"
            subtext="Bids matching parameters"
          />
          <StatCard
            label="Pending Review"
            value={pendingCount}
            icon={<Tag className="w-5 h-5" />}
            gradient="from-amber-500 to-orange-600"
            subtext="Awaiting patient response"
          />
          <StatCard
            label="Accepted Bids"
            value={acceptedCount}
            icon={<CheckCircle className="w-5 h-5" />}
            gradient="from-emerald-500 to-teal-600"
            subtext="Converted to orders"
          />
          <StatCard
            label="Failed / Cancelled"
            value={failedCount}
            icon={<XCircle className="w-5 h-5" />}
            gradient="from-rose-500 to-red-600"
            subtext="Did not proceed"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 animate-fadeIn">
              {/* Search */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    className="w-full h-10 bg-slate-50 dark:bg-[#0b0f19] border border-slate-250 dark:border-slate-700 rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-700 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-white"
                    placeholder="Pharmacy Name..."
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
              <div className="flex items-end gap-3 pb-0.5 sm:col-span-2 lg:col-start-4 lg:col-span-1">
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
            <h4 className="text-lg font-bold">Failed to load bids</h4>
            <p className="text-sm mt-1 text-rose-600 dark:text-rose-400/80">
              {(error as any)?.message || "There was an issue communicating with the backend API. Please verify the endpoint is online."}
            </p>
          </div>
        ) : bidsList.length === 0 ? (
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Bid ID
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Pharmacy Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                      Total Price
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                      Delivery Fee
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                      Items
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Submitted Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {bidsList.map((bid) => (
                    <tr
                      key={bid.id}
                      onClick={() => navigate(`/admin/bids/${bid.id}`)}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      {/* Bid ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-sky-600 dark:text-sky-400 font-bold">
                          #{bid.id}
                        </span>
                      </td>

                      {/* Pharmacy Name */}
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{bid.pharmacyName || "—"}</span>
                      </td>

                      {/* Pharmacy Rating */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <span className="text-amber-400 text-lg leading-none">★</span>
                          {bid.pharmacyRating != null ? bid.pharmacyRating.toFixed(1) : "—"}
                        </span>
                      </td>

                      {/* Total Price */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-slate-800 dark:text-slate-200">
                          EGP {bid.totalPrice != null ? bid.totalPrice.toFixed(2) : "0.00"}
                        </span>
                      </td>

                      {/* Delivery Fee */}
                      <td className="px-6 py-4 text-right">
                        <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                          EGP {bid.deliveryFee != null ? bid.deliveryFee.toFixed(2) : "0.00"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[bid.status] || STATUS_STYLES.Pending}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[bid.status] || STATUS_DOT.Pending}`} />
                          {bid.status || "Pending"}
                        </span>
                      </td>

                      {/* Items Count */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-black border ${
                          (bid.bidItems?.length || 0) > 0
                            ? "bg-sky-50 text-sky-600 border-sky-100 shadow-sm dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20"
                            : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/50 dark:text-slate-500 dark:border-slate-700"
                        }`}>
                          {bid.bidItems?.length || 0}
                        </span>
                      </td>

                      {/* Submitted Date */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          {formatDateTime(bid.submittedAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/bids/${bid.id}`);
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm"
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
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{(pageIndex - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {Math.min(pageIndex * pageSize, totalCount)}
                </span>{" "}
                of <span className="font-semibold text-slate-700 dark:text-slate-300">{totalCount.toLocaleString()}</span> bids
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
