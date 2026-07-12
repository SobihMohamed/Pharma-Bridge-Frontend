import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetNearbyRequestsQuery, useGetRequestDetailsForPharmacyQuery } from '../api/pharmacyRequests';
import {
  Search,
  MapPin,
  Clock,
  Flame,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  HeartPulse,
  FilterX,
  Pill,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface PharmacyRequestSummary {
  id: number;
  medicineName: string;
  status: string;
  deliveryArea: string;
  createdAt: string;
  expiresAt: string;
  bidsCount: number;
}

export interface PharmacyRequestDetails extends PharmacyRequestSummary {
  imageUrl?: string | null;
  patientNotes?: string | null;
}

// ---------- Config ----------
const STATUS_TABS = [
  { label: "All Requests", value: "All" },
  { label: "Pending Bids", value: "Pending" },
  { label: "Has Bids", value: "HasBids" },
  { label: "Closed", value: "Closed" },
  { label: "Cancelled", value: "Cancelled" },
];

const STATUS_CONFIG: Record<string, { badgeClass: string; dotClass: string }> = {
  Pending:   { badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400', dotClass: 'bg-emerald-500' },
  HasBids:   { badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400', dotClass: 'bg-blue-500' },
  Closed:    { badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400', dotClass: 'bg-violet-500' },
  Cancelled: { badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400', dotClass: 'bg-rose-500' },
};

const ACCENT_COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  if (diffInSeconds <= 0) return 'Expired';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m left`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h left`;
  return `${Math.floor(diffInSeconds / 86400)}d left`;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-EG', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

// ---------- Sub-components ----------
interface RequestDetailsSheetContentProps {
  id: number;
  onClose: () => void;
}

function RequestDetailsSheetContent({ id, onClose }: RequestDetailsSheetContentProps) {
  const navigate = useNavigate();
  const { data: request, isLoading, isError } = useGetRequestDetailsForPharmacyQuery(id);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full space-y-5 p-6 bg-white dark:bg-slate-900">
        <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="h-7 bg-slate-100 dark:bg-slate-800 rounded-xl w-3/4 animate-pulse mt-4" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/2 animate-pulse" />
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-xl w-full animate-pulse" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-xl w-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4 bg-white dark:bg-slate-900">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center">
          <X className="w-8 h-8 text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Failed to load details</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The request might have been removed or expired.</p>
        </div>
        <Button variant="outline" onClick={onClose} className="mt-4 rounded-xl dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">Close</Button>
      </div>
    );
  }

  const isExpired = new Date(request.expiresAt).getTime() < new Date().getTime();
  const canBid = !isExpired && (request.status === 'Pending' || request.status === 'HasBids');
  const cfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.Pending;
  const accent = ACCENT_COLORS[request.id % ACCENT_COLORS.length];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <SheetHeader className="px-6 py-5 border-b border-slate-150 dark:border-slate-800 shrink-0 text-left bg-slate-50/50 dark:bg-slate-950/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" 
              style={{ backgroundColor: accent + '18', marginRight: '14px' }}
            >
              <Pill className="w-5 h-5" style={{ color: accent }} />
            </div>
            <div>
              <SheetTitle className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                {request.medicineName}
              </SheetTitle>
              <SheetDescription className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Posted {formatDate(request.createdAt)}
              </SheetDescription>
            </div>
          </div>
          <span
            className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border border-transparent flex items-center gap-1.5 ${cfg.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
            {request.status}
          </span>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 relative group flex items-center justify-center">
            {request.imageUrl ? (
              <img
                src={request.imageUrl}
                alt="Prescription"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-450 p-6">
                <HeartPulse className="w-10 h-10 mb-2 text-sky-400 dark:text-sky-500" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">No Prescription Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Delivery Area
              </h4>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {request.deliveryArea}
              </p>
            </div>

            {request.patientNotes && (
              <div>
                <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-violet-500" />
                  Patient Notes
                </h4>
                <p className="text-sm text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {request.patientNotes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-amber-50/30 dark:bg-amber-950/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/35">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-1 font-bold text-xs uppercase tracking-wide">
                  <Flame className="w-4 h-4" />
                  Bids Placed
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">
                  {request.bidsCount} <span className="text-xs font-semibold text-slate-400">offers</span>
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isExpired ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800' : 'bg-sky-50/30 dark:bg-sky-950/10 border-sky-100 dark:border-sky-900/30'}`}>
                <div 
                  className={`flex items-center gap-2 mb-1 font-bold text-xs uppercase tracking-wide ${isExpired ? 'text-slate-500 dark:text-slate-400' : 'text-sky-600 dark:text-sky-400'}`}
                >
                  <Clock className="w-4 h-4" />
                  Time Remaining
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">
                  {isExpired ? 'Expired' : getRelativeTime(request.expiresAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <Button
          className={`w-full h-11 text-xs font-bold rounded-xl transition-all ${canBid ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/25 hover:from-sky-500 hover:to-sky-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
          disabled={!canBid}
          onClick={() => {
            onClose();
            navigate(`/pharmacy/requests/${request.id}/bid`, { state: { requestData: request } });
          }}
        >
          {canBid ? 'Submit Bid Offer' : 'Bidding Closed'}
        </Button>
      </div>
    </div>
  );
}

export default function PharmacyRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageIndex = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'All';
  const pageSize = 12;

  const [activeRequestId, setActiveRequestId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [searchValue, setSearchValue] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (searchValue !== currentSearch) {
        const newParams = new URLSearchParams(searchParams);
        if (searchValue) newParams.set('search', searchValue);
        else newParams.delete('search');
        newParams.set('page', '1');
        setSearchParams(newParams);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, setSearchParams, searchParams]);

  const { data, isLoading, isError } = useGetNearbyRequestsQuery({
    pageIndex,
    pageSize,
    search: search || undefined,
    status: status !== 'All' ? status : undefined,
  });

  const requests: PharmacyRequestSummary[] = data?.data || [];
  const totalCount: number = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleStatusTabChange = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'All') newParams.set('status', val);
    else newParams.delete('status');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="space-y-6" style={{ paddingTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px' }}>

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* <div style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <HeartPulse className="w-6 h-6" style={{ color: '#fff' }} />
            </div> */}
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Nearby Requests</h1>
              <p className="text-sm mt-0.5 text-slate-450 dark:text-slate-500">Browse patient prescriptions in your area.</p>
            </div>
          </div>

          {/* Count Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-3xl font-black tabular-nums text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-xs font-semibold leading-tight text-slate-400 dark:text-slate-500">
              Nearby<br />Requests
            </span>
          </div>
        </div>

        {/* ── Filter Toolbar Panel ── */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 shadow-sm rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            
            {/* Status Tabs Navigation */}
            <div className="flex flex-wrap p-1 rounded-xl gap-1 bg-slate-50 dark:bg-slate-950/40">
              {STATUS_TABS.map((tab) => {
                const isActive = status === tab.value;
                const cfg = STATUS_CONFIG[tab.value];
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusTabChange(tab.value)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
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

            {/* Actions & Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border shadow-sm transition-colors ${
                  showFilters 
                    ? 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800' 
                    : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
              {(searchValue || status !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search inputs expandable */}
          {showFilters && (
            <div className="px-4 pb-4 border-t pt-4 border-slate-100 dark:border-slate-800">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search by medicine name, ingredients..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-8 h-9 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus-visible:ring-sky-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Grid List Content ── */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-white dark:bg-slate-900/50 rounded-2xl border p-6 animate-pulse border-slate-100 dark:border-slate-800" style={{ height: '210px' }}>
                  <div className="h-4 rounded-lg w-1/3 mb-4 bg-slate-100 dark:bg-slate-800" />
                  <div className="h-8 rounded-xl w-2/3 mb-4 bg-slate-50 dark:bg-slate-950/40" />
                  <div className="h-3 rounded w-full mb-2 bg-slate-100 dark:bg-slate-800" />
                  <div className="h-10 rounded-xl w-full mt-auto bg-slate-100 dark:bg-slate-800" />
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border bg-rose-50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30">
              <p className="font-bold text-rose-800 dark:text-rose-400">Failed to load requests. Please try again.</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 bg-white dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-sky-50 dark:bg-sky-950/20">
                <HeartPulse className="w-7 h-7 text-sky-500 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">No Requests Found</h3>
              <p className="text-sm text-center max-w-xs text-slate-400 dark:text-slate-500">
                We couldn't find any patient requests matching your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {requests.map((request, i) => {
                  const isExpired = new Date(request.expiresAt).getTime() < new Date().getTime();
                  const canBid = !isExpired && (request.status === 'Pending' || request.status === 'HasBids');
                  const cfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.Pending;
                  const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];

                  return (
                    <div
                      key={request.id}
                      className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                      onClick={() => setActiveRequestId(request.id)}
                    >
                      {/* Accent top line */}
                      <div className="h-[3px] w-full" style={{ backgroundColor: accent }} />

                      <div className="p-6 flex-1 flex flex-col gap-4">
                        
                        {/* Top Meta: Request ID & Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: accent + '18' }}
                            >
                              <Pill className="w-4 h-4" style={{ color: accent }} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Request #{request.id}</span>
                          </div>
                          
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${cfg.badgeClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                            {request.status}
                          </span>
                        </div>

                        {/* Medicine Name */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-450 dark:text-slate-500">Medicine Name</p>
                          <h3
                            className={`text-lg font-black tracking-tight line-clamp-2 ${isExpired ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}
                          >
                            {request.medicineName}
                          </h3>
                        </div>

                        {/* Delivery Area */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                          <span className="truncate" title={request.deliveryArea}>{request.deliveryArea}</span>
                        </div>

                        {/* Bids placed count if any */}
                        {request.bidsCount > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full self-start text-amber-800 dark:text-amber-450 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                            <Flame className="w-3.5 h-3.5" />
                            {request.bidsCount} Bid{request.bidsCount !== 1 ? 's' : ''} Placed
                          </div>
                        )}

                        {/* Date & Time info */}
                        <div className="flex items-center justify-between text-[11px] pt-3 border-t mt-auto border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(request.createdAt)}
                          </span>
                          <span
                            className={`flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded-full ${isExpired ? 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' : 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30'}`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {isExpired ? 'Expired' : getRelativeTime(request.expiresAt)}
                          </span>
                        </div>
                      </div>

                      {/* Footer Details Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRequestId(request.id);
                        }}
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
                    onClick={() => handlePageChange(Math.max(1, pageIndex - 1))}
                    disabled={pageIndex === 1}
                    className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center transition-all disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                        pageIndex === pageNum
                          ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-800'
                          : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, pageIndex + 1))}
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

      {/* Details Sheet */}
      <Sheet open={!!activeRequestId} onOpenChange={(isOpen) => !isOpen && setActiveRequestId(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-white dark:bg-slate-900 border-l-0 sm:border-l border-slate-100 dark:border-slate-800 sm:rounded-l-3xl shadow-2xl">
          {activeRequestId && (
            <RequestDetailsSheetContent
              id={activeRequestId}
              onClose={() => setActiveRequestId(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}