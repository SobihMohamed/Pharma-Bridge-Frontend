import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminBidsQuery, AdminBidsParams } from "../hooks/useAdminBidsQuery";
import { AdminBidListItemDto } from "../services/adminService";

// ---------- Constants ----------

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Accepted", value: "Accepted" },
  { label: "Rejected", value: "Rejected" },
  { label: "Expired", value: "Expired" },
  { label: "Cancelled", value: "Cancelled" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50",
  Accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50",
  Expired: "bg-slate-100 text-slate-600 border border-slate-300/50",
  Cancelled: "bg-slate-500/10 text-slate-700 border border-slate-300/50",
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

function TableSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-12 bg-slate-50 border-b border-slate-200/80" />
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex px-6 py-4 items-center justify-between space-x-4">
            <div className="h-4 bg-slate-100 rounded w-16" />
            <div className="h-4 bg-slate-100 rounded w-28 flex-1" />
            <div className="h-4 bg-slate-100 rounded w-20" />
            <div className="h-4 bg-slate-100 rounded w-16" />
            <div className="h-4 bg-slate-100 rounded w-16" />
            <div className="h-4 bg-slate-100 rounded w-20" />
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-4 bg-slate-100 rounded w-20" />
            <div className="h-4 bg-slate-100 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 text-slate-400">
        <span className="material-symbols-outlined text-[32px]">gavel</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">No bids found</h3>
      <p className="text-slate-550 text-sm max-w-sm mb-5">
        No bids match your current filter criteria. Try adjusting the filters or clearing them.
      </p>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-label-md text-label-md rounded-lg border border-slate-200 transition-colors"
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
  PrescriptionRequestId: string;
  FromDate: string;
  ToDate: string;
}

const INITIAL_FILTERS: FilterState = {
  Search: "",
  Status: "",
  PrescriptionRequestId: "",
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
  const pageSize = 10;

  // Build query params from applied filters
  const queryParams: AdminBidsParams = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    Search: appliedFilters.Search || undefined,
    Status: appliedFilters.Status || undefined,
    PrescriptionRequestId: appliedFilters.PrescriptionRequestId || undefined,
    FromDate: appliedFilters.FromDate || undefined,
    ToDate: appliedFilters.ToDate || undefined,
  };

  const { data, isLoading, isError, error } = useAdminBidsQuery(queryParams);

  const bidsList: AdminBidListItemDto[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // ---- Handlers ----

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [field]: value };

      // Auto-clear To Date if it is earlier than the new From Date
      if (field === "FromDate" && next.ToDate && next.ToDate < value) {
        next.ToDate = "";
      }

      return next;
    });
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
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-6 bg-[#F8FAFC]">
        {/* Page Header */}
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Bids</h3>
          <p className="text-slate-550 text-sm mt-0.5">
            Browse, filter and review all pharmacy bids submitted for prescription requests.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-slate-400 text-[20px]">filter_list</span>
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Filters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Search</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  search
                </span>
                <input
                  className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Search bid ID, pharmacy..."
                  type="text"
                  value={filters.Search}
                  onChange={(e) => handleFilterChange("Search", e.target.value)}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</label>
              <select
                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                value={filters.Status}
                onChange={(e) => handleFilterChange("Status", e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prescription Request ID */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Prescription Request ID</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  description
                </span>
                <input
                  className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. 5"
                  type="text"
                  value={filters.PrescriptionRequestId}
                  onChange={(e) => handleFilterChange("PrescriptionRequestId", e.target.value)}
                />
              </div>
            </div>

            {/* From Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">From Date</label>
              <input
                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                type="date"
                min="2026-01-01"
                value={filters.FromDate}
                onChange={(e) => handleFilterChange("FromDate", e.target.value)}
              />
            </div>

            {/* To Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To Date</label>
              <input
                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                type="date"
                min={filters.FromDate || "2026-01-01"}
                value={filters.ToDate}
                onChange={(e) => handleFilterChange("ToDate", e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleApplyFilters}
              className="h-10 px-5 bg-primary hover:opacity-90 text-white font-label-md text-label-md rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-label-md text-label-md rounded-lg flex items-center gap-2 transition-colors border border-slate-200"
              >
              <span className="material-symbols-outlined text-[16px]">close</span>
              Clear
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="bg-rose-50 text-rose-750 border border-rose-200/50 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px] mb-2 text-rose-500">warning</span>
            <h4 className="text-lg font-bold">Failed to load bids</h4>
            <p className="text-sm mt-1 text-rose-600">
              {(error as any)?.message || "There was an issue communicating with the backend API. Please verify the endpoint is online."}
            </p>
          </div>
        ) : bidsList.length === 0 ? (
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col transition-all duration-300">
            {/* Results count */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[13px] text-slate-500">
                Showing <span className="font-semibold text-slate-700">{(pageIndex - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(pageIndex * pageSize, totalCount)}
                </span>{" "}
                of <span className="font-semibold text-slate-700">{totalCount.toLocaleString()}</span> bids
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80">
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Bid ID
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Pharmacy Name
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Request ID
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Total Price
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Delivery Fee
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Submitted Date
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Delivery Time
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bidsList.map((bid) => (
                    <tr
                      key={bid.id}
                      onClick={() => navigate(`/admin/bids/${bid.id}`)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      {/* Bid ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono-sm text-mono-sm text-primary font-bold">
                          #{bid.id}
                        </span>
                      </td>

                      {/* Pharmacy Name */}
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-slate-700 font-medium">{bid.pharmacyName || "—"}</span>
                      </td>

                      {/* Prescription Request ID */}
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-slate-600">
                          {bid.prescriptionRequestId != null ? `#${bid.prescriptionRequestId}` : "—"}
                        </span>
                      </td>

                      {/* Total Price */}
                      <td className="px-6 py-4">
                        <span className="font-mono-sm text-mono-sm text-slate-800">
                          ${bid.totalPrice != null ? bid.totalPrice.toFixed(2) : "0.00"}
                        </span>
                      </td>

                      {/* Delivery Fee */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-600">
                          ${bid.deliveryFee != null ? bid.deliveryFee.toFixed(2) : "0.00"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[bid.status] || STATUS_STYLES.Pending}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[bid.status] || STATUS_DOT.Pending}`} />
                          {bid.status || "Pending"}
                        </span>
                      </td>

                      {/* Submitted Date */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-600">{formatDateTime(bid.submittedAt)}</span>
                      </td>

                      {/* Delivery Time */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-600">{bid.deliveryTime || "—"}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/admin/bids/${bid.id}`)}
                          className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/30 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[13px] text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">{(pageIndex - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(pageIndex * pageSize, totalCount)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-700">{totalCount.toLocaleString()}</span> bids
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={pageIndex === 1}
                    onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:text-slate-300 transition-all shadow-sm"
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
                            : "border border-slate-200 hover:bg-slate-100 text-slate-650"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={pageIndex >= totalPages}
                    onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:text-slate-300 transition-all shadow-sm"
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
