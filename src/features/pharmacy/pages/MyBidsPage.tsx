import React, { useState, useEffect } from 'react';
import {
  Package, Clock, Search, FilterX, CalendarDays,
  AlertCircle, ChevronLeft, ChevronRight, Pill,
  SlidersHorizontal, ArrowRight
} from 'lucide-react';
import { usePagination } from '@/shared/hooks/usePagination';
import { useGetPharmacyBidsQuery, BidDto } from '../api/bidding';
import { useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ---------- Config ----------
const STATUS_TABS = ['All', 'Pending', 'Accepted', 'Rejected', 'Cancelled'];

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:   { bg: '#fefce8', text: '#92400e', dot: '#eab308' },
  Accepted:  { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' },
  Rejected:  { bg: '#fff1f2', text: '#9f1239', dot: '#f43f5e' },
  Cancelled: { bg: '#f8fafc', text: '#475569', dot: '#94a3b8' },
};

const ACCENT_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-EG', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function MyBidsPage() {
  const navigate = useNavigate();
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 9 });
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate]     = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: profile } = useMyPharmacyProfileQuery();
  const rawId = (profile as any)?.data?.id || (profile as any)?.id;
  const pharmacyId = rawId ? Number(rawId) : 1;

  const { data: paginatedBids, isLoading, isError } = useGetPharmacyBidsQuery(pharmacyId, {
    Status: statusFilter === 'All' ? undefined : statusFilter,
    Search: debouncedSearch || undefined,
    FromDate: fromDate || undefined,
    ToDate: toDate || undefined,
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const bids: BidDto[]   = paginatedBids?.data || [];
  const totalCount        = paginatedBids?.totalCount || 0;
  const totalPages        = Math.ceil(totalCount / pageSize);
  const hasFilters        = statusFilter !== 'All' || searchInput || fromDate || toDate;

  const handleClear = () => {
    setStatusFilter('All'); setSearchInput('');
    setFromDate(''); setToDate(''); setPageIndex(1);
  };

  return (
    <div className="space-y-6" style={{ paddingTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px' }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}
            >
              <Package className="w-6 h-6" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: '#0f172a' }}>My Bids</h1>
              <p className="text-sm" style={{ color: '#94a3b8' }}>Your submitted prescription offers</p>
            </div>
          </div>

          {/* Total count badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm"
            style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
          >
            <span className="text-3xl font-black tabular-nums" style={{ color: '#0f172a' }}>{totalCount}</span>
            <span className="text-xs font-semibold leading-tight" style={{ color: '#94a3b8' }}>
              Total<br />Bids
            </span>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            {/* Status tabs */}
            <div className="flex flex-wrap gap-1 p-1 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
              {STATUS_TABS.map(tab => {
                const isActive = statusFilter === tab;
                const cfg = STATUS_CONFIG[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => { setStatusFilter(tab); setPageIndex(1); }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200"
                    style={isActive
                      ? { backgroundColor: '#0f172a', color: '#fff' }
                      : { color: '#64748b', backgroundColor: 'transparent' }
                    }
                  >
                    {cfg && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isActive ? '#ffffff88' : cfg.dot }}
                      />
                    )}
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                style={{
                  backgroundColor: showFilters ? '#f8fafc' : '#fff',
                  borderColor: '#e2e8f0',
                  color: showFilters ? '#0f172a' : '#64748b',
                }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
              {hasFilters && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}
                >
                  <FilterX className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search & Date drawer */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-4 pb-4 border-t pt-4" style={{ borderColor: '#f1f5f9' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
                <Input
                  value={searchInput}
                  onChange={e => { setSearchInput(e.target.value); setPageIndex(1); }}
                  placeholder="Search bids..."
                  className="pl-8 h-9 text-xs rounded-xl border"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' }}
                />
              </div>
              <Input type="date" value={fromDate}
                onChange={e => { setFromDate(e.target.value); setPageIndex(1); }}
                className="h-9 text-xs rounded-xl border"
                style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' }}
              />
              <Input type="date" value={toDate}
                onChange={e => { setToDate(e.target.value); setPageIndex(1); }}
                className="h-9 text-xs rounded-xl border"
                style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' }}
              />
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-5 animate-pulse" style={{ borderColor: '#f1f5f9', height: '200px' }}>
                <div className="h-4 rounded-lg w-1/3 mb-4" style={{ backgroundColor: '#f1f5f9' }} />
                <div className="h-8 rounded-xl w-2/3 mb-4" style={{ backgroundColor: '#f8fafc' }} />
                <div className="h-3 rounded w-full mb-2" style={{ backgroundColor: '#f1f5f9' }} />
                <div className="h-10 rounded-xl w-full mt-auto" style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border" style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}>
            <AlertCircle className="w-10 h-10 mb-3" style={{ color: '#f43f5e' }} />
            <p className="font-bold" style={{ color: '#9f1239' }}>Failed to load bids</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white rounded-2xl border-2 border-dashed" style={{ borderColor: '#e2e8f0' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f5f3ff' }}>
              <Package className="w-7 h-7" style={{ color: '#8b5cf6' }} />
            </div>
            <p className="text-base font-bold mb-1" style={{ color: '#0f172a' }}>No Bids Found</p>
            <p className="text-sm mb-5 text-center max-w-xs" style={{ color: '#94a3b8' }}>
              {hasFilters ? 'Try clearing your filters.' : 'No bids submitted yet.'}
            </p>
            <Button
              onClick={hasFilters ? handleClear : () => navigate('/pharmacy/live-requests')}
              className="h-9 px-5 rounded-xl text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: '#fff', border: 'none' }}
            >
              {hasFilters ? 'Clear Filters' : 'Browse Requests'}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bids.map((bid: BidDto, i: number) => {
                const cfg    = STATUS_CONFIG[bid.status] || STATUS_CONFIG.Cancelled;
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                return (
                  <div
                    key={bid.id}
                    className="bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    {/* Thin accent top bar */}
                    <div className="h-[3px] w-full" style={{ backgroundColor: accent }} />

                    <div className="p-6 flex-1 flex flex-col gap-5">
                      {/* Bid ID + Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: accent + '18' }}
                          >
                            <Pill className="w-4 h-4" style={{ color: accent }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>Bid #{bid.id}</span>
                        </div>
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                          style={{ backgroundColor: cfg.bg, color: cfg.text }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
                          {bid.status}
                        </span>
                      </div>

                      {/* Price */}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#cbd5e1' }}>Total Price</p>
                        <p className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
                          {bid.totalPrice?.toFixed(2)}
                          <span className="text-sm font-semibold ml-1" style={{ color: '#94a3b8' }}>EGP</span>
                        </p>
                      </div>

                      {/* Items */}
                      <p className="text-xs" style={{ color: '#64748b' }}>
                        <span className="font-bold" style={{ color: accent }}>{bid.bidItems?.length || 0}</span>{' '}
                        item{(bid.bidItems?.length || 0) !== 1 ? 's' : ''}
                        {bid.bidItems?.[0] && (
                          <span style={{ color: '#94a3b8' }}> — {bid.bidItems[0].itemName}</span>
                        )}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-[11px] pt-3 border-t" style={{ borderColor: '#f1f5f9', color: '#94a3b8' }}>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatDate(bid.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#0d9488' }}>
                          <Clock className="w-3.5 h-3.5" />
                          {bid.deliveryTimeInMinutes} min
                        </span>
                      </div>
                    </div>

                    {/* Details button */}
                    <button
                      onClick={() => navigate(`/pharmacy/bids/${bid.id}`)}
                      className="flex items-center justify-between px-6 py-4 w-full text-left transition-all border-t hover:opacity-80 active:scale-[0.99]"
                      style={{ borderColor: '#f1f5f9', backgroundColor: '#fafafa' }}
                    >
                      <span className="text-xs font-bold" style={{ color: '#0f172a' }}>View Details</span>
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
                  onClick={() => setPageIndex(Math.max(1, pageIndex - 1))}
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
                      : { backgroundColor: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPageIndex(Math.min(totalPages, pageIndex + 1))}
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
