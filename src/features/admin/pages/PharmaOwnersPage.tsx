import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminPharmaOwnersQuery } from "../hooks/useAdminPharmaOwnersQuery";
import { PharmaOwnerDto } from "../services/adminPharmaOwnersService";
import {
  Search,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  SlidersHorizontal,
  Mail,
  Phone,
  Eye,
  Sliders,
} from "lucide-react";

// ---------- Constants ----------

const STATUS_TABS = [
  { label: "All Owners", value: "All", color: "bg-slate-400" },
  { label: "Pending Review", value: "Pending", color: "bg-amber-500" },
  { label: "Approved", value: "Approved", color: "bg-emerald-500" },
  { label: "Rejected", value: "Rejected", color: "bg-rose-500" },
  { label: "Blocked", value: "Blocked", color: "bg-slate-700" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50",
  Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50",
  Blocked: "bg-slate-100 text-slate-700 border border-slate-350",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  Approved: "bg-emerald-500",
  Rejected: "bg-rose-500",
  Blocked: "bg-slate-500",
};

// Modern Hex Colors for Avatars
const AVATAR_HEX = [
  "#3b82f6", // blue
  "#fb7185", // rose
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#14b8a6", // teal
];

function avatarBg(i: number): React.CSSProperties {
  return { backgroundColor: AVATAR_HEX[i % AVATAR_HEX.length] };
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
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-black text-slate-800 tracking-tight tabular-nums">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      {subtext && (
        <p className="text-xs text-slate-400 font-medium mt-3.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
          {subtext}
        </p>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-14 bg-slate-50/50 border-b border-slate-100" />
      <div className="divide-y divide-slate-150">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex px-6 py-4 items-center justify-between space-x-4">
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-4 bg-slate-100 rounded w-20" />
            <div className="h-4 bg-slate-100 rounded w-32 flex-1" />
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-4 bg-slate-100 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 text-slate-400">
        <Users className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">No pharma owners found</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-5">
        We couldn't find any pharma owner profile matching your search query or filters. Try clearing the filters or adjusting terms.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
      >
        Clear All Filters
      </button>
    </div>
  );
}

export default function PharmaOwnersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // Debounce search input to limit API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(1);
    }, 600);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch paginated pharma owners data
  const { data, isLoading, isError, error } = useAdminPharmaOwnersQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
    Search: debouncedSearch || undefined,
    Status: status === "All" ? undefined : status,
  });

  const pharmaOwnersList: PharmaOwnerDto[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const pageCount = pharmaOwnersList.length;

  const approvedCount = pharmaOwnersList.filter((owner) => owner.status === "Approved").length;
  const pendingCount = pharmaOwnersList.filter((owner) => owner.status === "Pending").length;
  const blockedCount = pharmaOwnersList.filter((owner) => owner.status === "Blocked").length;

  const handleClearFilters = () => {
    setSearch("");
    setStatus("All");
    setPageIndex(1);
  };

  const handleStatusTabChange = (statusVal: string) => {
    setStatus(statusVal);
    setPageIndex(1);
  };

  return (
    <AdminLayout title="Pharma Owners">
      <div className="p-6 space-y-6 bg-[#F4F6FA] min-h-screen">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pharma Owners</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Review and manage registration requests for network pharmacy owners.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200/50 rounded-full px-3.5 py-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Platform Database
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Owners"
            value={totalCount}
            icon={<Users className="w-5 h-5" />}
            gradient="from-indigo-500 to-violet-600"
            subtext="Registered pharmacy owners"
          />
          <StatCard
            label="Approved"
            value={approvedCount}
            icon={<UserCheck className="w-5 h-5" />}
            gradient="from-emerald-500 to-teal-600"
            subtext="Verified profiles ready"
          />
          <StatCard
            label="Pending Review"
            value={pendingCount}
            icon={<Clock className="w-5 h-5" />}
            gradient="from-amber-500 to-orange-600"
            subtext="Awaiting verification"
          />
          <StatCard
            label="Blocked Accounts"
            value={blockedCount}
            icon={<UserX className="w-5 h-5" />}
            gradient="from-slate-600 to-slate-800"
            subtext="Restricted platform access"
          />
        </div>

        {/* Filters and Search Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
          
          <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Tabs Selection */}
            <div className="flex flex-wrap bg-slate-50 p-1 rounded-xl gap-1">
              {STATUS_TABS.map((tab) => {
                const isActive = status === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusTabChange(tab.value)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                    }`}
                  >
                    {tab.value !== "All" && <span className={`w-2 h-2 rounded-full ${tab.color}`} />}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all placeholder:text-slate-400 shadow-inner"
                placeholder="Search by Name, Email..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Data List Container */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="bg-rose-50 text-rose-750 border border-rose-200/50 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <XCircle className="w-8 h-8 mx-auto text-rose-500 mb-2" />
            <h4 className="text-lg font-bold">Failed to load pharma owners</h4>
            <p className="text-sm mt-1 text-rose-600">
              {(error as any)?.message ||
                "There was an issue communicating with the backend API. Please verify the endpoint is online."}
            </p>
          </div>
        ) : pharmaOwnersList.length === 0 ? (
          <EmptyState onClear={handleClearFilters} />
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Owner Profile
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Email Address
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pharmaOwnersList.map((owner, i) => {
                    const initials = getInitials(owner.fullName);
                    return (
                      <tr
                        key={owner.id}
                        onClick={() => navigate(`/admin/pharma-owners/${owner.id}`)}
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                      >
                        {/* Profile Block */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              style={avatarBg(i)}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm"
                            >
                              {initials}
                            </div>
                            <span className="font-semibold text-slate-800 text-[14px]">
                              {owner.fullName}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <span className="text-[14px] text-slate-500 font-medium flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {owner.email}
                          </span>
                        </td>

                        {/* Phone Number */}
                        <td className="px-6 py-4">
                          <span className="text-[14px] text-slate-500 font-medium flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {owner.phoneNumber || "—"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[owner.status] || STATUS_STYLES.Pending}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[owner.status] || STATUS_DOT.Pending}`} />
                            {owner.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/admin/pharma-owners/${owner.id}`)}
                            className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
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
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-medium">
                Showing <span className="font-semibold text-slate-700">{(pageIndex - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(pageIndex * pageSize, totalCount)}
                </span>{" "}
                of <span className="font-semibold text-slate-700">{totalCount.toLocaleString()}</span> owners
              </span>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={pageIndex === 1}
                    onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:text-slate-350 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPaginationRange(pageIndex, totalPages).map((p, index) => {
                    if (p === "...") {
                      return (
                        <span key={`dots-${index}`} className="px-2 text-slate-400 text-sm font-bold">
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
                            ? "bg-slate-900 text-white shadow-sm"
                            : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-650"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={pageIndex >= totalPages}
                    onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:text-slate-350 transition-all shadow-sm"
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
