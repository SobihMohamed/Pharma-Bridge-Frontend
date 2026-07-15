import React, { useState, useEffect } from 'react';
import {
  Package, Clock, Search, FilterX, CalendarDays,
  AlertCircle, ChevronLeft, ChevronRight, Pill,
  SlidersHorizontal, ArrowRight
} from 'lucide-react';
import { AppPagination } from '@/shared/ui/AppPagination';
import { formatLocalDateTime } from '@/utils/formatTime';
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
const STATUS_TABS = ['All Bids', 'Pending', 'Accepted', 'Rejected', 'Cancelled'];

const STATUS_CONFIG: Record<string, { badgeClass: string; dotClass: string }> = {
  Pending:   { badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30', dotClass: 'bg-amber-500' },
  Accepted:  { badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30', dotClass: 'bg-emerald-500' },
  Rejected:  { badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30', dotClass: 'bg-rose-500' },
  Cancelled: { badgeClass: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-850', dotClass: 'bg-slate-400' },
};

const ACCENT_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

function formatDate(dateStr: string): string {
  return formatLocalDateTime(dateStr);
}

export default function MyBidsPage() {
  const navigate = useNavigate();
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 9 });
  const [statusFilter, setStatusFilter] = useState('All Bids');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate]     = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: profile } = useMyPharmacyProfileQuery();
  const rawId = (profile as any)?.data?.id || (profile as any)?.id;
  const pharmacyId = rawId ? Number(rawId) : 1;

  const { data: paginatedBids, isLoading, isError } = useGetPharmacyBidsQuery(pharmacyId, {
    Status: statusFilter === 'All Bids' ? undefined : statusFilter,
    Search: debouncedSearch || undefined,
    FromDate: fromDate || undefined,
    ToDate: toDate || undefined,
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const bids: BidDto[]   = paginatedBids?.data || [];
  const totalCount        = paginatedBids?.totalCount || 0;
  const totalPages        = Math.ceil(totalCount / pageSize);
  const hasFilters        = statusFilter !== 'All Bids' || searchInput || fromDate || toDate;

  const handleClear = () => {
    setStatusFilter('All Bids'); setSearchInput('');
    setFromDate(''); setToDate(''); setPageIndex(1);
  };

  return (
    <div className="space-y-6" style={{ paddingTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px' }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">My Bids</h1>
              <p className="text-sm text-slate-450 dark:text-slate-500">Your submitted prescription offers</p>
            </div>
          </div>

          {/* Total count badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-3xl font-black tabular-nums text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-xs font-semibold leading-tight text-slate-400 dark:text-slate-500">
              Total<br />Bids
            </span>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm border border-slate-150 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            {/* Status tabs */}
            <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-50 dark:bg-slate-950/45">
              {STATUS_TABS.map(tab => {
                const isActive = statusFilter === tab;
                const cfg = STATUS_CONFIG[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => { setStatusFilter(tab); setPageIndex(1); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {cfg && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white dark:bg-slate-100' : cfg.dotClass}`}
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
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all ${
                  showFilters 
                    ? 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800' 
                    : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
              {hasFilters && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search & Date drawer */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-4 pb-4 border-t pt-4 border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  value={searchInput}
                  onChange={e => { setSearchInput(e.target.value); setPageIndex(1); }}
                  placeholder="Search bids..."
                  className="pl-8 h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus-visible:ring-sky-500"
                />
              </div>
              <Input type="date" value={fromDate}
                onChange={e => { setFromDate(e.target.value); setPageIndex(1); }}
                className="h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
              <Input type="date" value={toDate}
                onChange={e => { setToDate(e.target.value); setPageIndex(1); }}
                className="h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>
          )}
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900/50 rounded-2xl border p-5 animate-pulse border-slate-100 dark:border-slate-800" style={{ height: '200px' }}>
                <div className="h-4 rounded-lg w-1/3 mb-4 bg-slate-100 dark:bg-slate-800" />
                <div className="h-8 rounded-xl w-2/3 mb-4 bg-slate-50 dark:bg-slate-955" />
                <div className="h-3 rounded w-full mb-2 bg-slate-100 dark:bg-slate-800" />
                <div className="h-10 rounded-xl w-full mt-auto bg-slate-100 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border bg-rose-50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30">
            <AlertCircle className="w-10 h-10 mb-3 text-rose-500 dark:text-rose-450" />
            <p className="font-bold text-rose-800 dark:text-rose-400">Failed to load bids</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-violet-50 dark:bg-violet-950/20">
              <Package className="w-7 h-7 text-violet-500 dark:text-violet-400" />
            </div>
            <p className="text-base font-bold mb-1 text-slate-900 dark:text-white">No Bids Found</p>
            <p className="text-sm mb-5 text-center max-w-xs text-slate-400 dark:text-slate-500">
              {hasFilters ? 'Try clearing your filters.' : 'No bids submitted yet.'}
            </p>
            <Button
              onClick={hasFilters ? handleClear : () => navigate('/pharmacy/live-requests')}
              className="h-9 px-5 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white border-none"
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
                    className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
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
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bid #{bid.id}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${cfg.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                          {bid.status}
                        </span>
                      </div>

                      {/* Price */}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-450 dark:text-slate-500">Total Price</p>
                        <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                          {bid.totalPrice?.toFixed(2)}
                          <span className="text-sm font-semibold ml-1 text-slate-400 dark:text-slate-500">EGP</span>
                        </p>
                      </div>

                      {/* Items */}
                      <p className="text-xs text-slate-500 dark:text-slate-450">
                        <span className="font-bold" style={{ color: accent }}>{bid.bidItems?.length || 0}</span>{' '}
                        item{(bid.bidItems?.length || 0) !== 1 ? 's' : ''}
                        {bid.bidItems?.[0] && (
                          <span className="text-slate-400 dark:text-slate-500"> — {bid.bidItems[0].itemName}</span>
                        )}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatDate(bid.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400">
                          <Clock className="w-3.5 h-3.5" />
                          {bid.deliveryTimeInMinutes} min
                        </span>
                      </div>
                    </div>

                    {/* Details button */}
                    <button
                      onClick={() => navigate(`/pharmacy/bids/${bid.id}`)}
                      className="flex items-center justify-between px-6 py-4 w-full text-left transition-all border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100/40 dark:hover:bg-slate-900/20 active:scale-[0.99]"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-350">View Details</span>
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
                        : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPageIndex(Math.min(totalPages, pageIndex + 1))}
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
