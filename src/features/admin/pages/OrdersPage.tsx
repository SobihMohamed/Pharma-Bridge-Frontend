import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminOrdersQuery, AdminOrdersParams } from "../hooks/useAdminOrdersQuery";
import { useAllPatientsDropdownQuery } from "../hooks/useAdminPrescriptionRequestsQuery";
import { useAllPharmaciesDropdownQuery } from "../hooks/useAdminComplaintsQuery";
import { AdminOrderDto } from "../services/adminService";

// ---------- Constants ----------

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Accepted", value: "Accepted" },
  { label: "In Transit", value: "InTransit" },
  { label: "Preparing", value: "Preparing" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Returned", value: "Returned" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50",
  Accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  InTransit: "bg-sky-50 text-sky-700 border border-sky-200/50",
  Preparing: "bg-blue-50 text-blue-700 border border-blue-200/50",
  Completed: "bg-primary/15 text-primary border border-primary/30",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200/50",
  Returned: "bg-slate-500/10 text-slate-700 border border-slate-300/50",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  Accepted: "bg-emerald-500",
  InTransit: "bg-sky-500",
  Preparing: "bg-blue-500",
  Completed: "bg-primary",
  Cancelled: "bg-rose-500",
  Returned: "bg-slate-500",
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

const formatDateTime = (iso: string) => {
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
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-4 bg-slate-100 rounded w-28 flex-1" />
            <div className="h-4 bg-slate-100 rounded w-28 flex-1" />
            <div className="h-4 bg-slate-100 rounded w-16" />
            <div className="h-4 bg-slate-100 rounded w-20" />
            <div className="h-4 bg-slate-100 rounded w-16" />
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
        <span className="material-symbols-outlined text-[32px]">shopping_cart</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">No orders found</h3>
      <p className="text-slate-550 text-sm max-w-sm mb-5">
        No orders match your current filter criteria. Try adjusting the filters or clearing them.
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
  FromDate: string;
  ToDate: string;
  PharmacyId: string;
  PatientId: string;
}

const INITIAL_FILTERS: FilterState = {
  Search: "",
  Status: "",
  FromDate: "",
  ToDate: "",
  PharmacyId: "",
  PatientId: "",
};

export default function OrdersPage() {
  const navigate = useNavigate();

  // Filter form state (not yet applied)
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Applied filters (sent to API)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTERS);

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // Build query params from applied filters
  const queryParams: AdminOrdersParams = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    Search: appliedFilters.Search || undefined,
    Status: appliedFilters.Status || undefined,
    FromDate: appliedFilters.FromDate || undefined,
    ToDate: appliedFilters.ToDate || undefined,
    PharmacyId: appliedFilters.PharmacyId || undefined,
    PatientId: appliedFilters.PatientId || undefined,
  };

  const { data, isLoading, isError, error } = useAdminOrdersQuery(queryParams);
  const { data: patientsData } = useAllPatientsDropdownQuery();
  const { data: pharmaciesData } = useAllPharmaciesDropdownQuery();

  const ordersList: AdminOrderDto[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const patientOptions = patientsData?.data || [];
  const pharmacyOptions = pharmaciesData?.data || [];

  // ---- Handlers ----

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [field]: value };
      
      // Auto-clear or restrict To Date if it is earlier than the new From Date
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
          <h3 className="text-2xl font-bold text-slate-800">Orders</h3>
          <p className="text-slate-550 text-sm mt-0.5">
            Browse, filter and monitor all customer medication orders on the platform.
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
                  placeholder="Search order ID, patient, pharmacy..."
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

            {/* Pharmacy */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pharmacy</label>
              <select
                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                value={filters.PharmacyId}
                onChange={(e) => handleFilterChange("PharmacyId", e.target.value)}
              >
                <option value="">All Pharmacies</option>
                {pharmacyOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.pharmacyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Patient</label>
              <select
                className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                value={filters.PatientId}
                onChange={(e) => handleFilterChange("PatientId", e.target.value)}
              >
                <option value="">All Patients</option>
                {patientOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName}
                  </option>
                ))}
              </select>
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
            <h4 className="text-lg font-bold">Failed to load orders</h4>
            <p className="text-sm mt-1 text-rose-600">
              {(error as any)?.message || "There was an issue communicating with the backend API. Please verify the endpoint is online."}
            </p>
          </div>
        ) : ordersList.length === 0 ? (
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
                of <span className="font-semibold text-slate-700">{totalCount.toLocaleString()}</span> orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80">
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Order ID
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Patient Name
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Pharmacy Name
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Order Status
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 font-label-md text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ordersList.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono-sm text-mono-sm text-primary font-bold">
                          #{order.id}
                        </span>
                      </td>

                      {/* Patient Name */}
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-slate-700">{order.patientName || "—"}</span>
                      </td>

                      {/* Pharmacy Name */}
                      <td className="px-6 py-4">
                        <span className="text-[14px] text-slate-700 font-medium">{order.pharmacyName || "—"}</span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <span className="font-mono-sm text-mono-sm text-slate-800">
                          ${order.amount != null ? order.amount.toFixed(2) : "0.00"}
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[order.orderStatus] || STATUS_STYLES.Processing}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.orderStatus] || STATUS_DOT.Processing}`} />
                          {order.orderStatus || "Processing"}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-650">{order.paymentMethod || "—"}</span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-slate-600">{formatDateTime(order.createdAt)}</span>
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
                  of <span className="font-semibold text-slate-700">{totalCount.toLocaleString()}</span> orders
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
