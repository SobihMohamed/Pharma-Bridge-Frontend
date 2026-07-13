import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Clock, User, ChevronLeft, ChevronRight,
  PackageOpen, ArrowRight, ShoppingBag, SlidersHorizontal
} from 'lucide-react';
import { useGetPharmacyOrdersQuery } from '../api/orders';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OrderSummaryDto } from '@/features/orders/api/orders';

// ---------- Config ----------
const STATUS_TABS = [
  { label: 'All Orders',  value: 'all'       },
  { label: 'Preparing',   value: 'Preparing'  },
  { label: 'In Transit',  value: 'InTransit'  },
  { label: 'Completed',   value: 'Completed'  },
  { label: 'Cancelled',   value: 'Cancelled'  },
];

const STATUS_CONFIG: Record<string, { badgeClass: string; dotClass: string; bar: string }> = {
  Preparing:  { badgeClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400', dotClass: 'bg-orange-500', bar: '#f97316' },
  InTransit:  { badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400', dotClass: 'bg-blue-500', bar: '#3b82f6' },
  Completed:  { badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400', dotClass: 'bg-emerald-500', bar: '#10b981' },
  Delivered:  { badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400', dotClass: 'bg-emerald-500', bar: '#10b981' },
  Accepted:   { badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400', dotClass: 'bg-sky-500', bar: '#0ea5e9' },
  Pending:    { badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400', dotClass: 'bg-amber-500', bar: '#eab308' },
  Cancelled:  { badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400', dotClass: 'bg-rose-500', bar: '#f43f5e' },
  Returned:   { badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400', dotClass: 'bg-rose-500', bar: '#f43f5e' },
};

const PAYMENT_CONFIG: Record<string, string> = {
  Paid:    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  Unpaid:  'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
};

const ACCENT_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#14b8a6','#f97316'];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getStatusLabel(status: string): string {
  if (status === 'InTransit') return 'In Transit';
  return status;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]       = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [pageIndex, setPageIndex]       = useState(1);
  const [showSearch, setShowSearch]     = useState(false);
  const pageSize = 12;

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(searchQuery); setPageIndex(1); }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data, isLoading, isError } = useGetPharmacyOrdersQuery({
    Status: activeTab !== 'all' ? activeTab : undefined,
    Search: debouncedSearch || undefined,
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const orders: OrderSummaryDto[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6" style={{ paddingTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px' }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Active Orders</h1>
              <p className="text-sm text-slate-400 dark:text-slate-500">Manage fulfillments and track deliveries.</p>
            </div>
          </div>

          {/* Count badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-3xl font-black tabular-nums text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-xs font-semibold leading-tight text-slate-400 dark:text-slate-500">
              Total<br />Orders
            </span>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            {/* Status tabs */}
            <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-50 dark:bg-slate-950/45">
              {STATUS_TABS.map(tab => {
                const isActive = activeTab === tab.value;
                const cfg = STATUS_CONFIG[tab.value];
                return (
                  <button
                    key={tab.value}
                    onClick={() => { setActiveTab(tab.value); setPageIndex(1); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {cfg && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/60' : cfg.dotClass}`}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search toggle */}
            <button
              onClick={() => setShowSearch(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                showSearch
                  ? 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Search
            </button>
          </div>

          {showSearch && (
            <div className="px-4 pb-4 border-t pt-4 border-slate-100 dark:border-slate-800">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search by order ID or patient name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus-visible:ring-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 animate-pulse" style={{ height: '210px' }}>
                <div className="h-4 rounded-lg w-1/3 mb-4 bg-slate-100 dark:bg-slate-800" />
                <div className="h-8 rounded-xl w-2/3 mb-4 bg-slate-50 dark:bg-slate-800/60" />
                <div className="h-3 rounded w-full mb-2 bg-slate-100 dark:bg-slate-800" />
                <div className="h-10 rounded-xl w-full mt-auto bg-slate-100 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border bg-rose-50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30">
            <p className="font-bold text-rose-700 dark:text-rose-400">Failed to load orders</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white dark:bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-sky-50 dark:bg-sky-950/20">
              <PackageOpen className="w-7 h-7 text-sky-500 dark:text-sky-400" />
            </div>
            <p className="text-base font-bold mb-1 text-slate-900 dark:text-white">No Orders Found</p>
            <p className="text-sm text-center max-w-xs text-slate-400 dark:text-slate-500">
              {searchQuery
                ? `No results for "${searchQuery}".`
                : `No orders in "${STATUS_TABS.find(t => t.value === activeTab)?.label}" status.`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders.map((order: OrderSummaryDto, i: number) => {
                const cfg    = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Pending;
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                const payCfg = PAYMENT_CONFIG[order.paymentStatus] || PAYMENT_CONFIG.Unpaid;

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Thin accent bar */}
                    <div className="h-[3px] w-full" style={{ backgroundColor: accent }} />

                    <div className="p-6 flex-1 flex flex-col gap-5">
                      {/* Order ID + Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: accent + '18' }}
                          >
                            <ShoppingBag className="w-4 h-4" style={{ color: accent }} />
                          </div>
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Order #{order.id}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${cfg.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                          {getStatusLabel(order.orderStatus)}
                        </span>
                      </div>

                      {/* Patient */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: accent + '15' }}
                        >
                          <User className="w-5 h-5" style={{ color: accent }} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate text-slate-900 dark:text-white">{order.patientName}</p>
                          <div className="flex items-center gap-1.5 text-[11px] mt-0.5 text-slate-400 dark:text-slate-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Amount + Payment */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-400 dark:text-slate-500">Total Amount</p>
                          <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            {order.amount.toFixed(2)}
                            <span className="text-sm font-semibold ml-1 text-slate-400 dark:text-slate-500">EGP</span>
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl ${payCfg}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Manage footer */}
                    <button
                      onClick={() => navigate(`/pharmacy/orders/${order.id}`)}
                      className="flex items-center justify-between px-6 py-4 w-full text-left transition-all border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100/40 dark:hover:bg-slate-900/20 active:scale-[0.99]"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-300">Manage Order</span>
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: accent + '18' }}
                      >
                        <ArrowRight className="w-3.5 h-3.5" style={{ color: accent }} />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-4">
                <button
                  onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                  disabled={pageIndex === 1}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center transition-all disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPageIndex(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                      pageIndex === p
                        ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-800'
                        : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                  disabled={pageIndex === totalPages}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center transition-all disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
}
