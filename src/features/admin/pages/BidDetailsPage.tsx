import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminBidDetailsQuery } from "../hooks/useAdminBidsQuery";
import { AdminBidDetailItemDto } from "../services/adminService";
import { Gavel, CircleDollarSign, PackageSearch, ArrowLeft, Pill, AlertTriangle } from "lucide-react";

// ---------- Constants ----------

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

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.Pending}`} />
      {status}
    </span>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0 py-2 border-b border-slate-50/50 dark:border-slate-800/50 last:border-0 transition-colors duration-300">
      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sm:w-48 shrink-0 flex items-center transition-colors duration-300">
        {label}
      </span>
      <span className="text-[14px] text-slate-700 dark:text-slate-200 font-semibold transition-colors duration-300">{children}</span>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
      </div>
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
    </div>
  );
}

function BidItemsTable({ items }: { items: AdminBidDetailItemDto[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="w-16 h-16 bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 transition-colors duration-300">
          <PackageSearch className="w-8 h-8" />
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors duration-300">No bid items available</p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 transition-colors duration-300">This bid does not contain any item entries.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <th className="px-5 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item Name</th>
            <th className="px-5 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Qty</th>
            <th className="px-5 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Unit Price</th>
            <th className="px-5 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Line Total</th>
            <th className="px-5 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Alternative</th>
            <th className="px-5 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alt. Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-[#0f172a] transition-colors duration-300">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors duration-300 group">
              <td className="px-5 py-4 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-300">
                  <Pill className="w-4 h-4" />
                </div>
                {item.itemName || "—"}
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium text-center">{item.quantity}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="px-5 py-4 text-slate-800 dark:text-white font-black text-right">${item.lineTotal.toFixed(2)}</td>
              <td className="px-5 py-4 text-center">
                {item.isAlternative ? (
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20 text-[10px] font-bold transition-colors duration-300">Yes</span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300">No</span>
                )}
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-[13px] font-medium max-w-[200px] truncate transition-colors duration-300" title={item.alternativeNote || undefined}>
                {item.alternativeNote || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Main Page ----------

export default function BidDetailsPage() {
  const { bidId } = useParams<{ bidId: string }>();
  const navigate = useNavigate();

  const { data: details, isLoading, isError } = useAdminBidDetailsQuery(bidId || "");

  return (
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-6 bg-[#F8FAFC] dark:bg-[#0b0f19] transition-colors duration-300">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/bids")}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-300 text-sm font-bold bg-white dark:bg-[#0f172a] px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md dark:hover:bg-slate-800/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bids
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20 rounded-3xl p-10 text-center max-w-xl mx-auto shadow-sm transition-colors duration-300">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-rose-500 opacity-80" />
            <h4 className="text-xl font-bold">Failed to load bid details</h4>
            <p className="text-sm mt-2 text-rose-600 dark:text-rose-400 font-medium">
              Could not fetch bid data. The bid may not exist or the API may be unavailable.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Page Heading */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight transition-colors duration-300">Bid Details</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium transition-colors duration-300">
                  Reviewing submission <span className="font-bold text-slate-700 dark:text-slate-300">#{details.id}</span>
                </p>
              </div>
            </div>

            {/* Bid Information & Pricing Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bid Info */}
              <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors duration-300">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest transition-colors duration-300">Bid Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <DetailRow label="Bid ID">
                    <span className="text-primary dark:text-blue-400">#{details.id}</span>
                  </DetailRow>
                  <DetailRow label="Status">
                    <StatusBadge status={details.status} />
                  </DetailRow>
                  <DetailRow label="Pharmacy Name">{details.pharmacyName || "—"}</DetailRow>
                  <DetailRow label="Pharmacy ID">{details.pharmacyId != null ? `#${details.pharmacyId}` : "—"}</DetailRow>
                  <DetailRow label="Request ID">
                    {details.prescriptionRequestId != null ? `#${details.prescriptionRequestId}` : "—"}
                  </DetailRow>
                  <DetailRow label="Submitted Date">{formatDateTime(details.submittedAt)}</DetailRow>
                  <DetailRow label="Responded Date">{formatDateTime(details.respondedAt)}</DetailRow>
                  <DetailRow label="Delivery Time">
                    {details.deliveryTimeInMinutes != null ? `${details.deliveryTimeInMinutes} mins` : "—"}
                  </DetailRow>
                  <div className="sm:col-span-2 pt-2">
                    <DetailRow label="Notes">{details.notes || "—"}</DetailRow>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors duration-300">
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest transition-colors duration-300">Pricing</span>
                </div>

                <div className="space-y-4 relative z-10 flex flex-col h-[calc(100%-80px)]">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800 dark:text-white transition-colors duration-300">
                      ${details.subtotal != null ? details.subtotal.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  {details.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-rose-500 dark:text-rose-400 font-medium transition-colors duration-300">
                      <span>Discount</span>
                      <span className="font-bold">-${details.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-slate-800 dark:text-white transition-colors duration-300">
                      ${details.deliveryFee != null ? details.deliveryFee.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">
                    <span>Platform Fee</span>
                    <span className="font-bold text-slate-800 dark:text-white transition-colors duration-300">
                      ${details.platformFee != null ? details.platformFee.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  
                  <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-between items-center transition-colors duration-300">
                    <span className="text-base font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300">Total Price</span>
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums transition-colors duration-300">
                      ${details.totalPrice != null ? details.totalPrice.toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid Items Table Card */}
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-80" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center transition-colors duration-300">
                    <PackageSearch className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest transition-colors duration-300">Bid Items</span>
                </div>
                {details.bidItems && details.bidItems.length > 0 && (
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-100/50 dark:border-teal-500/20 uppercase tracking-wider transition-colors duration-300">
                    {details.bidItems.length} {details.bidItems.length === 1 ? "Item" : "Items"}
                  </span>
                )}
              </div>

              <BidItemsTable items={details.bidItems} />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
