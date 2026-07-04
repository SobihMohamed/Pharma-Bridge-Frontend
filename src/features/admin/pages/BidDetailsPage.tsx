import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminBidDetailsQuery } from "../hooks/useAdminBidsQuery";
import { AdminBidDetailItemDto } from "../services/adminService";

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
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider sm:w-48 shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-slate-800 font-medium">{children}</span>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-2/5" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 rounded w-1/4" />
        <div className="h-32 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

function BidItemsTable({ items }: { items: AdminBidDetailItemDto[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100 text-slate-400">
          <span className="material-symbols-outlined text-[28px]">inventory_2</span>
        </div>
        <p className="text-slate-500 text-sm font-medium">No bid items available</p>
        <p className="text-slate-400 text-xs mt-0.5">This bid does not contain any item entries.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-3 rounded-lg border border-slate-100">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80">
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Item Name</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Qty</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Line Total</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Alternative</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Alt. Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
              <td className="px-4 py-2.5 text-slate-800 font-medium">{item.itemName || "—"}</td>
              <td className="px-4 py-2.5 text-slate-600 text-center">{item.quantity}</td>
              <td className="px-4 py-2.5 text-slate-600 text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-slate-800 font-semibold text-right">${item.lineTotal.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-center">
                {item.isAlternative ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold">Yes</span>
                ) : (
                  <span className="text-slate-400 text-xs">No</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-slate-500 text-[13px] max-w-[200px] truncate" title={item.alternativeNote || undefined}>
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
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-6 bg-[#F8FAFC]">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/bids")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Bids
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 text-rose-700 border border-rose-200/50 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px] mb-2 text-rose-500">warning</span>
            <h4 className="text-lg font-bold">Failed to load bid details</h4>
            <p className="text-sm mt-1 text-rose-600">
              Could not fetch bid data. The bid may not exist or the API may be unavailable.
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Bid Details</h3>
              <p className="text-slate-500 text-sm mt-0.5">
                Bid #{details.id}
              </p>
            </div>

            {/* Bid Information & Pricing Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bid Info */}
              <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">gavel</span>
                  <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Bid Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Bid ID">#{details.id}</DetailRow>
                  <DetailRow label="Status">
                    <StatusBadge status={details.status} />
                  </DetailRow>
                  <DetailRow label="Pharmacy Name">{details.pharmacyName || "—"}</DetailRow>
                  <DetailRow label="Request ID">
                    {details.prescriptionRequestId != null ? `#${details.prescriptionRequestId}` : "—"}
                  </DetailRow>
                  <DetailRow label="Submitted Date">{formatDateTime(details.submittedAt)}</DetailRow>
                  <DetailRow label="Responded Date">{formatDateTime(details.respondedAt)}</DetailRow>
                  <DetailRow label="Delivery Time">{details.deliveryTime || "—"}</DetailRow>
                  <div className="sm:col-span-2">
                    <DetailRow label="Notes">{details.notes || "—"}</DetailRow>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">payments</span>
                  <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Pricing</span>
                </div>

                <div className="space-y-2.5 flex-1">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">
                      ${details.subtotal != null ? details.subtotal.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  {details.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-rose-600">
                      <span>Discount</span>
                      <span className="font-semibold">-${details.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-800">
                      ${details.deliveryFee != null ? details.deliveryFee.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-slate-800">
                      ${details.platformFee != null ? details.platformFee.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                    <span className="text-base font-bold text-slate-800">Total Price</span>
                    <span className="text-xl font-bold text-primary">
                      ${details.totalPrice != null ? details.totalPrice.toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid Items Table Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">vaccines</span>
                  <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Bid Items</span>
                </div>
                {details.items && details.items.length > 0 && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {details.items.length} {details.items.length === 1 ? "Item" : "Items"}
                  </span>
                )}
              </div>

              <BidItemsTable items={details.items} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
