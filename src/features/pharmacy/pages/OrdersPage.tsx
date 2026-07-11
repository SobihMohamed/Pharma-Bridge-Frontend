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

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; bar: string }> = {
  Preparing:  { bg: '#fff7ed', text: '#c2410c', dot: '#f97316', bar: '#f97316' },
  InTransit:  { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', bar: '#3b82f6' },
  Completed:  { bg: '#ecfdf5', text: '#065f46', dot: '#10b981', bar: '#10b981' },
  Delivered:  { bg: '#ecfdf5', text: '#065f46', dot: '#10b981', bar: '#10b981' },
  Accepted:   { bg: '#f0f9ff', text: '#0369a1', dot: '#0ea5e9', bar: '#0ea5e9' },
  Pending:    { bg: '#fefce8', text: '#92400e', dot: '#eab308', bar: '#eab308' },
  Cancelled:  { bg: '#fff1f2', text: '#9f1239', dot: '#f43f5e', bar: '#f43f5e' },
  Returned:   { bg: '#fff1f2', text: '#9f1239', dot: '#f43f5e', bar: '#f43f5e' },
};

const PAYMENT_CONFIG: Record<string, { bg: string; text: string }> = {
  Paid:    { bg: '#ecfdf5', text: '#065f46' },
  Unpaid:  { bg: '#fefce8', text: '#92400e' },
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
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}
            >
              <ShoppingBag className="w-6 h-6" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: '#0f172a' }}>Active Orders</h1>
              <p className="text-sm" style={{ color: '#94a3b8' }}>Manage fulfillments and track deliveries.</p>
            </div>
          </div>

          {/* Count badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm"
            style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
          >
            <span className="text-3xl font-black tabular-nums" style={{ color: '#0f172a' }}>{totalCount}</span>
            <span className="text-xs font-semibold leading-tight" style={{ color: '#94a3b8' }}>
              Total<br />Orders
            </span>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            {/* Status tabs */}
            <div className="flex flex-wrap gap-1 p-1 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
              {STATUS_TABS.map(tab => {
                const isActive = activeTab === tab.value;
                const cfg = STATUS_CONFIG[tab.value];
                return (
                  <button
                    key={tab.value}
                    onClick={() => { setActiveTab(tab.value); setPageIndex(1); }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200"
                    style={isActive
                      ? { backgroundColor: '#0f172a', color: '#fff' }
                      : { color: '#64748b' }
                    }
                  >
                    {cfg && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isActive ? '#ffffff88' : cfg.dot }}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold"
              style={{
                backgroundColor: showSearch ? '#f8fafc' : '#fff',
                borderColor: '#e2e8f0',
                color: showSearch ? '#0f172a' : '#64748b',
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Search
            </button>
          </div>

          {showSearch && (
            <div className="px-4 pb-4 border-t pt-4" style={{ borderColor: '#f1f5f9' }}>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
                <Input
                  placeholder="Search by order ID or patient name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs rounded-xl border"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 animate-pulse" style={{ borderColor: '#f1f5f9', height: '210px' }}>
                <div className="h-4 rounded-lg w-1/3 mb-4" style={{ backgroundColor: '#f1f5f9' }} />
                <div className="h-8 rounded-xl w-2/3 mb-4" style={{ backgroundColor: '#f8fafc' }} />
                <div className="h-3 rounded w-full mb-2" style={{ backgroundColor: '#f1f5f9' }} />
                <div className="h-10 rounded-xl w-full mt-auto" style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border" style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}>
            <p className="font-bold" style={{ color: '#9f1239' }}>Failed to load orders</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white rounded-2xl border-2 border-dashed" style={{ borderColor: '#e2e8f0' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f0f9ff' }}>
              <PackageOpen className="w-7 h-7" style={{ color: '#0ea5e9' }} />
            </div>
            <p className="text-base font-bold mb-1" style={{ color: '#0f172a' }}>No Orders Found</p>
            <p className="text-sm text-center max-w-xs" style={{ color: '#94a3b8' }}>
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
                    className="bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
                    style={{ borderColor: '#f1f5f9' }}
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
                          <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>Order #{order.id}</span>
                        </div>
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                          style={{ backgroundColor: cfg.bg, color: cfg.text }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
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
                          <p className="font-bold text-sm truncate" style={{ color: '#0f172a' }}>{order.patientName}</p>
                          <div className="flex items-center gap-1.5 text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>
                            <Clock className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Amount + Payment */}
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#f1f5f9' }}>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#cbd5e1' }}>Total Amount</p>
                          <p className="text-2xl font-black tracking-tight" style={{ color: '#0f172a' }}>
                            {order.amount.toFixed(2)}
                            <span className="text-sm font-semibold ml-1" style={{ color: '#94a3b8' }}>EGP</span>
                          </p>
                        </div>
                        <span
                          className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl"
                          style={{ backgroundColor: payCfg.bg, color: payCfg.text }}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Manage footer */}
                    <button
                      onClick={() => navigate(`/pharmacy/orders/${order.id}`)}
                      className="flex items-center justify-between px-6 py-4 w-full text-left transition-all border-t hover:opacity-80 active:scale-[0.99]"
                      style={{ borderColor: '#f1f5f9', backgroundColor: '#fafafa' }}
                    >
                      <span className="text-xs font-bold" style={{ color: '#0f172a' }}>Manage Order</span>
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
                  className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-40"
                  style={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#475569' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPageIndex(p)}
                    className="w-9 h-9 rounded-xl text-xs font-bold border transition-all"
                    style={pageIndex === p
                      ? { backgroundColor: '#0f172a', color: '#fff', borderColor: '#0f172a' }
                      : { backgroundColor: '#fff', color: '#64748b', borderColor: '#e2e8f0' }
                    }
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                  disabled={pageIndex === totalPages}
                  className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-40"
                  style={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#475569' }}
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
