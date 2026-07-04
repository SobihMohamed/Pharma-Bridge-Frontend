import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { adminService, Bid, BidStatus } from "../services/adminService";

const STATUS_STYLES: Record<BidStatus, string> = {
  Accepted: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-surface-variant text-on-surface-variant border-outline-variant",
  Rejected: "bg-error-container text-on-error-container border-error/20",
};

const AVATAR_BG: string[] = [
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-fixed text-on-tertiary-fixed",
  "bg-secondary-fixed-dim text-on-secondary-fixed",
  "bg-primary-fixed text-on-primary-fixed",
  "bg-tertiary-container text-on-tertiary-container",
];

export default function BidsPage() {
  const navigate = useNavigate();
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    adminService.getBids().then(setBids);
  }, []);

  return (
    <AdminLayout title="PharmaBridge Admin" searchPlaceholder="Quick search for Request ID or Pharmacy...">
      <div className="p-margin-page min-h-[calc(100vh-48px)]">
        {/* Page Header & Stats Overview */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="font-label-md text-label-md">Admin</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="font-label-md text-label-md text-primary">Bids</span>
            </nav>
            <h2 className="font-display-sm text-display-sm font-bold text-on-surface">Bids</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Manage and review pharmaceutical supplier competitive bids for active medication requests.
            </p>
          </div>
          <div className="flex gap-container-padding">
            <button className="flex items-center gap-2 bg-surface-container border border-outline-variant px-4 py-2 rounded font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-sm">file_download</span>
              Export CSV
            </button>
            <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-90 shadow-sm transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">add</span>
              New Request
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl mb-gutter overflow-hidden shadow-sm">
          <div className="p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                filter_list
              </span>
              <input
                className="w-full pl-10 border-outline-variant rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Filter by pharmacy or bid ID..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-tight">
                Status
              </label>
              <select className="border-outline-variant rounded-lg text-body-md py-1.5 focus:border-primary focus:ring-1 focus:ring-primary min-w-[140px]">
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Accepted</option>
                <option>Rejected</option>
                <option>Expired</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-tight">
                Sort By
              </label>
              <select className="border-outline-variant rounded-lg text-body-md py-1.5 focus:border-primary focus:ring-1 focus:ring-primary min-w-[140px]">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Amount: High to Low</option>
                <option>Amount: Low to High</option>
              </select>
            </div>
            <button className="text-primary font-label-md text-label-md hover:underline px-2">Clear Filters</button>
          </div>
        </section>

        {/* Data Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase">Bid ID</th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase">Request ID</th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase">
                    Pharmacy Name
                  </th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase">Amount</th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase text-center">
                    Status
                  </th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {bids.map((bid, i) => (
                  <tr key={bid.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 h-table-row-height font-mono-sm text-mono-sm text-primary">{bid.id}</td>
                    <td className="px-6 h-table-row-height text-body-md font-medium">{bid.requestId}</td>
                    <td className="px-6 h-table-row-height">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[10px] ${AVATAR_BG[i % AVATAR_BG.length]}`}
                        >
                          {bid.pharmacyInitials}
                        </div>
                        <span className="text-body-md font-semibold text-on-surface">{bid.pharmacyName}</span>
                      </div>
                    </td>
                    <td className="px-6 h-table-row-height font-mono-sm text-mono-sm text-on-surface">
                      ${bid.amount.toFixed(2)}
                    </td>
                    <td className="px-6 h-table-row-height text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${STATUS_STYLES[bid.status]}`}
                      >
                        {bid.status}
                      </span>
                    </td>
                    <td className="px-6 h-table-row-height text-right">
                      <button
                        onClick={() => navigate(`/admin/bids/${bid.id}`)}
                        className="text-primary font-label-md text-label-md hover:bg-primary-container/10 px-3 py-1 rounded transition-colors active:scale-95"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between border-t border-outline-variant">
            <div className="text-body-sm text-on-surface-variant">
              Showing <span className="font-bold text-on-surface">1 - {bids.length}</span> of{" "}
              <span className="font-bold text-on-surface">242</span> bids
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg text-outline hover:bg-surface-container-high transition-colors disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center">
                1
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center justify-center">
                2
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center justify-center">
                3
              </button>
              <span className="px-2 text-outline">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center justify-center">
                49
              </button>
              <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-on-surface-variant">Rows per page:</span>
              <select className="bg-transparent border-none text-body-sm font-bold text-on-surface focus:ring-0 cursor-pointer">
                <option>10</option>
                <option selected>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-margin-page py-6 border-t border-outline-variant flex justify-between items-center opacity-60">
          <p className="text-[11px] text-on-surface-variant font-mono-sm">
            © 2024 PharmaBridge Logistics Systems. v2.4.0-stable
          </p>
          <div className="flex gap-4">
            <a className="text-[11px] font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-[11px] font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
              System Status
            </a>
            <a className="text-[11px] font-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
              Support
            </a>
          </div>
        </footer>
      </div>
    </AdminLayout>
  );
}
