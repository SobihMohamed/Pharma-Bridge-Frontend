import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { formatLocalDateTime } from "@/utils/formatTime";
import { useAdminOrderDetailsQuery } from "../hooks/useAdminOrdersQuery";
import { AdminOrderDetailsDto, AdminOrderItemDto } from "../services/adminService";
import {
  ArrowLeft,
  AlertCircle,
  Info,
  Calendar,
  CreditCard,
  MapPin,
  User,
  Phone,
  Store,
  Wallet,
  ShoppingBag,
  CheckCircle,
  Star,
  MessageSquare,
} from "lucide-react";

// ---------- Constants ----------

const STATUS_STYLES: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700 border border-amber-200/50",
  "In Transit": "bg-sky-50 text-sky-700 border border-sky-200/50",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  Completed: "bg-indigo-50 text-indigo-700 border border-indigo-200/50",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200/50",
};

const STATUS_DOT: Record<string, string> = {
  Processing: "bg-amber-500",
  "In Transit": "bg-sky-500",
  Delivered: "bg-emerald-500",
  Completed: "bg-indigo-500",
  Cancelled: "bg-rose-500",
};

// ---------- Helpers ----------

const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return "—";
  return formatLocalDateTime(iso);
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

function DetailBox({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: React.ReactNode, subValue?: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
      <div className="text-slate-400 dark:text-slate-500 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">{value}</div>
        {subValue && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subValue}</div>}
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/5" />
      </div>
    </div>
  );
}

function OrderItemsTable({ items }: { items: AdminOrderItemDto[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm italic border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
        No items in this order.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Item Name</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Qty</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Line Total</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Alt?</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Alt. Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-5 py-3 text-slate-800 dark:text-slate-200 font-semibold">{item.itemName}</td>
              <td className="px-5 py-3 text-slate-600 dark:text-slate-400 text-center font-medium">{item.quantity}</td>
              <td className="px-5 py-3 text-slate-600 dark:text-slate-400 text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="px-5 py-3 text-slate-800 dark:text-slate-200 font-bold text-right">${item.lineTotal.toFixed(2)}</td>
              <td className="px-5 py-3 text-center">
                {item.isAlternative ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 text-[10px] font-bold">✓</span>
                ) : (
                  <span className="text-slate-300 dark:text-slate-600">—</span>
                )}
              </td>
              <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-[13px] max-w-[180px] truncate" title={item.alternativeNote || undefined}>
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
    <AdminLayout title="Order Details">
      <div className="p-6 md:p-8 min-h-screen space-y-6 bg-[#F4F6FA] dark:bg-[#0b0f19] transition-colors duration-300">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10 mx-auto text-rose-500 dark:text-rose-400 mb-2" />
            <h4 className="text-lg font-bold">Failed to load order details</h4>
            <p className="text-sm mt-1 text-rose-600 dark:text-rose-500">
              Could not fetch order data. The order may not exist or the API may be unavailable.
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Order Details</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Viewing detailed information for Order #{details.id}
                </p>
              </div>
              <StatusBadge status={details.orderStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Info & Parties & Items */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Order Information Card */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
                  
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Order Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailBox 
                      icon={<Info className="w-4 h-4" />}
                      label="Order ID" 
                      value={`#${details.id}`}
                    />
                    <DetailBox 
                      icon={<Calendar className="w-4 h-4" />}
                      label="Created At" 
                      value={formatDateTime(details.createdAt)}
                    />
                    <DetailBox 
                      icon={<CreditCard className="w-4 h-4" />}
                      label="Payment Method" 
                      value={details.paymentMethod || "—"}
                    />
                    <DetailBox 
                      icon={<CreditCard className="w-4 h-4" />}
                      label="Payment Status" 
                      value={details.paymentStatus || "—"}
                    />
                    
                    {details.deliveredAt && (
                      <DetailBox 
                        icon={<Calendar className="w-4 h-4" />}
                        label="Delivered At" 
                        value={formatDateTime(details.deliveredAt)}
                      />
                    )}
                    {details.completedAt && (
                      <DetailBox 
                        icon={<Calendar className="w-4 h-4" />}
                        label="Completed At" 
                        value={formatDateTime(details.completedAt)}
                      />
                    )}
                    {details.cancelledAt && (
                      <DetailBox 
                        icon={<Calendar className="w-4 h-4" />}
                        label="Cancelled At" 
                        value={formatDateTime(details.cancelledAt)}
                      />
                    )}
                    {details.cancelReason && (
                      <div className="sm:col-span-2">
                        <DetailBox 
                          icon={<Info className="w-4 h-4" />}
                          label="Cancel Reason" 
                          value={details.cancelReason}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Parties & Delivery */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-500" />
                  
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Parties & Delivery</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailBox 
                      icon={<User className="w-4 h-4" />}
                      label="Patient Name" 
                      value={details.patientName || "—"}
                    />
                    <DetailBox 
                      icon={<Phone className="w-4 h-4" />}
                      label="Patient Phone" 
                      value={details.patientPhone || "—"}
                    />
                    <DetailBox 
                      icon={<Store className="w-4 h-4" />}
                      label="Pharmacy Name" 
                      value={details.pharmacyName || "—"}
                    />
                    <DetailBox 
                      icon={<Phone className="w-4 h-4" />}
                      label="Pharmacy Phone" 
                      value={details.pharmacyPhone || "—"}
                    />
                    <div className="md:col-span-2">
                      <DetailBox 
                        icon={<MapPin className="w-4 h-4" />}
                        label="Delivery Address" 
                        value={details.deliveryAddress || "—"}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                  
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Order Items ({details.items.length})</span>
                  </div>

                  <OrderItemsTable items={details.items} />
                </div>
              </div>

              {/* Right Column: Pricing */}
              <div className="space-y-6">
                {/* Pricing Card */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Pricing Breakdown</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">${details.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Delivery Fee</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">${details.deliveryFee.toFixed(2)}</span>
                    </div>
                    
                    {details.discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-100 dark:border-rose-800/30">
                        <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                          Discount
                        </span>
                        <span className="font-bold text-rose-700 dark:text-rose-300">-${details.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Amount</span>
                          <span className="text-3xl font-black text-slate-800 dark:text-slate-200 tabular-nums">
                            ${details.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pharmacy Rating */}
                {details.pharmacyRating && (
                  <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
                    
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                        <Star className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Pharmacy Rating</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Rating Given</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-5 h-5 ${star <= details.pharmacyRating!.ratingValue ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 dark:text-slate-700'}`} 
                            />
                          ))}
                        </div>
                      </div>

                      {details.pharmacyRating.comment && (
                        <div>
                          <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Comment</span>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="leading-relaxed break-words">
                                {details.pharmacyRating.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
