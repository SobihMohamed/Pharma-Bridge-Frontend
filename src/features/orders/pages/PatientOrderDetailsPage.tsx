import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Store,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  Package,
  Truck,
  Banknote,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { useGetOrderDetailsQuery } from '../api/orders';
import { ReportIssueDialog } from '@/features/complaints/components/ReportIssueDialog';

const STEPS = [
  { key: 'Accepted',   label: 'Accepted',   Icon: CheckCircle2 },
  { key: 'Preparing',  label: 'Preparing',  Icon: Package },
  { key: 'In Transit', label: 'In Transit', Icon: Truck },
  { key: 'Completed',  label: 'Completed',  Icon: CheckCircle2 },
];

export default function PatientOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();

  const { data: order, isLoading, isError } = useGetOrderDetailsQuery(orderId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#c8e6ff] border-t-[#006590] rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-[#191c1e] dark:text-white">Order not found</h2>
        <p className="text-[#3e4850] dark:text-slate-400">The order you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-6 py-2 rounded-xl font-bold text-white bg-[#006590] hover:bg-[#00567c] transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const isCancelledOrReturned = order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned';

  // Map statuses to stepper display
  let displayStatus = order.orderStatus;
  if (displayStatus === 'Pending') displayStatus = 'Accepted';
  if (displayStatus === 'Delivered') displayStatus = 'Completed';
  if (displayStatus === 'InTransit') displayStatus = 'In Transit';
  const currentStepIndex = STEPS.findIndex((s) => s.key === displayStatus);

  const progressPercent =
    currentStepIndex <= 0 ? 0
    : currentStepIndex === 1 ? 33
    : currentStepIndex === 2 ? 66
    : 100;

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateString));

  return (
    <div
      className="mx-auto px-4 md:px-8 py-8 pb-24 transition-colors duration-300"
      style={{ maxWidth: '1440px', fontFamily: 'Inter, Manrope, sans-serif' }}
    >
      {/* ── Page Header ── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              aria-label="Go back"
              onClick={() => navigate('/orders')}
              className="w-10 h-10 rounded-full flex items-center justify-center -ml-2 transition-colors hover:bg-[#e6e8ea] dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5 text-[#006590]" />
            </button>
            <h1 className="text-[32px] leading-[40px] font-bold tracking-tight text-[#191c1e] dark:text-white">
              Order #{order.id}
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-8 text-[#3e4850] dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <p className="text-base">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* ── Main 12-col Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ─────── Left 8 cols ─────── */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Cancelled / Returned banner */}
          {isCancelledOrReturned ? (
            <div className="rounded-2xl p-6 flex items-center gap-4 bg-[#ffdad6]/50 border border-[#ffdad6] dark:bg-red-900/20 dark:border-red-800/50">
              <AlertCircle className="w-8 h-8 shrink-0 text-[#ba1a1a] dark:text-red-400" />
              <div>
                <h2 className="text-lg font-bold text-[#93000a] dark:text-red-400">Order {order.orderStatus}</h2>
                <p className="text-sm text-[#ba1a1a] dark:text-red-300">
                  {order.cancelReason || 'This order was cancelled and will not be fulfilled.'}
                </p>
              </div>
            </div>
          ) : (
            /* ── Stepper Card ── */
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#bec8d1] dark:border-slate-800 shadow-sm transition-colors duration-300">
              {/* Header row */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs font-bold text-[#3e4850] dark:text-slate-400 uppercase tracking-widest">
                  Delivery Progress
                </h2>
                {order.orderStatus === 'Delivered' && (
                  <span className="px-4 py-1 rounded-full font-bold text-xs text-[#006590] bg-[#009ada]/15">
                    Arrived {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : ''}
                  </span>
                )}
              </div>

              {/* Track + nodes */}
              <div className="relative px-6 pb-2">
                {/* BG track */}
                <div
                  className="absolute rounded-full"
                  style={{ top: 18, left: 64, right: 64, height: 3, background: '#e0e3e5' }}
                />
                {/* Filled track */}
                <div
                  className="absolute rounded-full transition-all duration-500"
                  style={{
                    top: 18,
                    left: 64,
                    height: 3,
                    background: '#006590',
                    width: `calc(${progressPercent / 100} * (100% - 128px))`,
                  }}
                />
                {/* Nodes */}
                <div className="flex justify-between relative z-10">
                  {STEPS.map(({ key, label, Icon }, idx) => {
                    const done = idx <= currentStepIndex;
                    return (
                      <div key={key} className="flex flex-col items-center">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors"
                          style={{
                            background: done ? '#006590' : '#ffffff',
                            borderColor: done ? '#006590' : '#bec8d1',
                            color: done ? '#ffffff' : '#bec8d1',
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className="mt-2 text-xs font-bold"
                          style={{ color: done ? '#006590' : '#6e7881' }}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Items Ordered ── */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden border border-[#bec8d1] dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#bec8d1] dark:border-slate-800">
              <h2 className="text-2xl font-bold text-[#191c1e] dark:text-white">Items Ordered</h2>
              <span className="text-base text-[#3e4850] dark:text-slate-400">
                {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 flex flex-col gap-3 hover:bg-[#f7f9fb] dark:hover:bg-slate-800 transition-colors border-b border-[#e0e3e5] dark:border-slate-800 last:border-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center bg-[#eceef0] dark:bg-slate-800 border border-[#bec8d1]/30 dark:border-slate-700">
                    <Package className="w-8 h-8 text-[#6e7881] dark:text-slate-400" />
                  </div>
                  {/* Info */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#006590]/10 text-[#006590]">
                        {item.quantity}x
                      </span>
                      <h3
                        className="font-bold text-base"
                        style={{ color: item.isAlternative ? '#895100' : '#191c1e' }}
                      >
                        {item.itemName}
                      </h3>
                    </div>
                    <p className="text-sm text-[#3e4850] dark:text-slate-400">{item.unitPrice.toFixed(2)} EGP each</p>
                  </div>
                  {/* Price */}
                  <div className="sm:text-right shrink-0">
                    <p className="text-xl font-bold text-[#191c1e] dark:text-white">
                      {item.lineTotal.toFixed(2)}{' '}
                      <span className="text-sm text-[#3e4850] dark:text-slate-400 font-semibold">EGP</span>
                    </p>
                  </div>
                </div>

                {/* Alternative Warning */}
                {item.isAlternative && (
                  <div className="ml-20 bg-[#ffdcbc]/30 dark:bg-amber-900/20 rounded-xl border border-[#ffdcbc] dark:border-amber-700/50 p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#895100] dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#895100] dark:text-amber-400 block text-sm mb-0.5">
                        Alternative Item Provided
                      </span>
                      <span className="text-[#683c00] dark:text-amber-300 text-xs leading-snug block">
                        {item.alternativeNote || 'The pharmacy substituted this item based on availability.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Fulfillment Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pharmacy */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#bec8d1] dark:border-slate-800 shadow-sm hover:border-[#006590]/30 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-5 text-[#006590]">
                <Store className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Prepared by</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[#191c1e] dark:text-white">{order.pharmacyName}</p>
                  <p className="text-sm text-[#3e4850] dark:text-slate-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-[#006590]" />
                    Registered Partner
                  </p>
                </div>
                {order.pharmacyPhone && (
                  <a
                    href={`tel:${order.pharmacyPhone}`}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-[#006590] bg-[#009ada]/15 hover:bg-[#009ada]/25 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#bec8d1] dark:border-slate-800 shadow-sm hover:border-[#006590]/30 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-5 text-[#006590]">
                <MapPin className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Delivery Address</h3>
              </div>
              <p className="text-lg font-bold text-[#191c1e] dark:text-white">
                {order.deliveryAddress || 'Address not provided'}
              </p>
              <p className="text-sm text-[#3e4850] dark:text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                (Full address after confirmation)
              </p>
            </div>
          </div>
        </div>

        {/* ─────── Right 4 cols ─────── */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Payment Summary */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#bec8d1] dark:border-slate-800 shadow-lg shadow-[#eceef0]/50 dark:shadow-black/20 sticky top-24 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-[#191c1e] dark:text-white mb-6">Payment Summary</h2>

            {/* Line items */}
            <div className="flex flex-col gap-4 pb-6 mb-6 border-b border-[#bec8d1] dark:border-slate-800">
              <div className="flex justify-between text-base">
                <span className="text-[#3e4850] dark:text-slate-400">Subtotal</span>
                <span className="font-medium text-[#191c1e] dark:text-white">{order.subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-[#3e4850] dark:text-slate-400">Delivery Fee</span>
                <span className="font-medium text-[#191c1e] dark:text-white">{order.deliveryFee.toFixed(2)} EGP</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-base">
                  <span className="text-[#3e4850] dark:text-slate-400">Applied Discount</span>
                  <span className="font-bold text-[#006590]">- {order.discountAmount.toFixed(2)} EGP</span>
                </div>
              )}
            </div>

            {/* Total + status */}
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#3e4850] dark:text-slate-400">
                  Total Amount
                </span>
                <p className="text-[32px] leading-none font-black text-[#006590]">
                  {order.amount.toFixed(2)} EGP
                </p>
              </div>
              <div className="text-right">
                <span className="block mb-1 text-xs text-[#3e4850] dark:text-slate-400">Status</span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase"
                  style={{
                    background: order.paymentStatus === 'Paid' ? '#e6f4ea' : '#e0e3e5',
                    color: order.paymentStatus === 'Paid' ? '#1e7e34' : '#191c1e',
                  }}
                >
                  {order.paymentStatus !== 'Paid' && (
                    <span className="w-2 h-2 rounded-full bg-[#6e7881] animate-pulse" />
                  )}
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-2xl p-4 bg-[#f2f4f6] dark:bg-[#0b0f19] border border-[#bec8d1]/30 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-[#131b2e] shadow-sm">
                  <Banknote className="w-5 h-5 text-[#006590]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#191c1e] dark:text-white">{order.paymentMethod}</p>
                  <p className="text-xs text-[#3e4850] dark:text-slate-400">Pay safely at your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Issue (Completed orders) */}
          {order.orderStatus === 'Completed' && (
            <div className="bg-[#f7f9fb] dark:bg-[#0b0f19] rounded-2xl p-6 border border-[#e0e3e5] dark:border-slate-800 text-center transition-colors duration-300">
              <p className="text-sm text-[#3e4850] dark:text-slate-400 font-medium mb-4">
                Something wrong with this order?
              </p>
              <ReportIssueDialog orderId={order.id} />
            </div>
          )}

          {/* Rate order (Delivered orders only) */}
          {order.orderStatus === 'Delivered' && (
            <div className="bg-[#f7f9fb] dark:bg-[#0b0f19] rounded-2xl p-6 border border-[#e0e3e5] dark:border-slate-800 text-center transition-colors duration-300">
              <p className="text-sm text-[#3e4850] dark:text-slate-400 font-medium mb-4">
                How was your experience?
              </p>
              <button
                className="w-full py-3 rounded-xl font-bold text-sm text-[#895100] dark:text-amber-400 flex items-center justify-center gap-2 bg-white dark:bg-[#0f172a] hover:bg-[#ffdcbc]/20 dark:hover:bg-amber-900/20 border border-[#ffdcbc] dark:border-amber-700/50 transition-colors"
              >
                <Star className="w-4 h-4" />
                Rate This Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
