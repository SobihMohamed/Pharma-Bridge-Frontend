import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminOrderDetailsQuery } from "../hooks/useAdminOrdersQuery";
import { AdminOrderDetailsDto, AdminOrderItemDto } from "../services/adminService";

// ---------- Constants ----------

const STATUS_STYLES: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700 border border-amber-200/50",
  "In Transit": "bg-sky-50 text-sky-700 border border-sky-200/50",
  Delivered: "bg-primary/15 text-primary border border-primary/30",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200/50",
};

const STATUS_DOT: Record<string, string> = {
  Processing: "bg-amber-500",
  "In Transit": "bg-sky-500",
  Delivered: "bg-primary",
  Cancelled: "bg-rose-500",
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.Processing}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.Processing}`} />
      {status}
    </span>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider sm:w-40 shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-slate-800">{children}</span>
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

function OrderItemsTable({ items }: { items: AdminOrderItemDto[] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic py-2 pl-2">No items in this order.</p>
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
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Alt?</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Alt. Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
              <td className="px-4 py-2.5 text-slate-800 font-medium">{item.itemName}</td>
              <td className="px-4 py-2.5 text-slate-600 text-center">{item.quantity}</td>
              <td className="px-4 py-2.5 text-slate-600 text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-slate-800 font-semibold text-right">${item.lineTotal.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-center">
                {item.isAlternative ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold">✓</span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-slate-500 text-[13px] max-w-[180px] truncate" title={item.alternativeNote || undefined}>
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

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data: details, isLoading, isError } = useAdminOrderDetailsQuery(orderId || "");

  return (
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-6 bg-[#F8FAFC]">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Orders
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 text-rose-700 border border-rose-200/50 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px] mb-2 text-rose-500">warning</span>
            <h4 className="text-lg font-bold">Failed to load order details</h4>
            <p className="text-sm mt-1 text-rose-600">
              Could not fetch order data. The order may not exist or the API may be unavailable.
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Order Details</h3>
              <p className="text-slate-550 text-sm mt-0.5">
                Order #{details.orderId}
              </p>
            </div>

            {/* Order Information & Pricing Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Info */}
              <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
                  <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Order Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Order ID">#{details.orderId}</DetailRow>
                  <DetailRow label="Status">
                    <StatusBadge status={details.orderStatus} />
                  </DetailRow>
                  <DetailRow label="Payment Method">{details.paymentMethod || "—"}</DetailRow>
                  <DetailRow label="Payment Status">{details.paymentStatus || "—"}</DetailRow>
                  <DetailRow label="Created At">{formatDateTime(details.createdAt)}</DetailRow>
                  {details.deliveredAt && (
                    <DetailRow label="Delivered At">{formatDateTime(details.deliveredAt)}</DetailRow>
                  )}
                  {details.completedAt && (
                    <DetailRow label="Completed At">{formatDateTime(details.completedAt)}</DetailRow>
                  )}
                  {details.cancelledAt && (
                    <DetailRow label="Cancelled At">{formatDateTime(details.cancelledAt)}</DetailRow>
                  )}
                  {details.cancelReason && (
                    <div className="sm:col-span-2">
                      <DetailRow label="Cancel Reason">{details.cancelReason}</DetailRow>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">payments</span>
                  <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Pricing</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">${details.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-800">${details.deliveryFee.toFixed(2)}</span>
                  </div>
                  {details.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-rose-600">
                      <span>Discount</span>
                      <span className="font-semibold">-${details.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                    <span className="text-base font-bold text-slate-800">Total Amount</span>
<span className="text-xl font-bold text-primary">
  ${details.amount.toFixed(2)}
</span>                  </div>
                </div>
              </div>
            </div>

            {/* Patient & Pharmacy & Delivery Info Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">handshake</span>
                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Parties & Delivery</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailRow label="Patient Name">{details.patientName || "—"}</DetailRow>
                <DetailRow label="Patient Phone">{details.patientPhone || "—"}</DetailRow>
                <DetailRow label="Pharmacy Name">{details.pharmacyName || "—"}</DetailRow>
                <DetailRow label="Pharmacy Phone">{details.pharmacyPhone || "—"}</DetailRow>
                <div className="md:col-span-2">
                  <DetailRow label="Delivery Address">{details.deliveryAddress || "—"}</DetailRow>
                </div>
              </div>
            </div>

            {/* Order Items Table Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">vaccines</span>
                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Order Items</span>
              </div>

              <OrderItemsTable items={details.items} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
