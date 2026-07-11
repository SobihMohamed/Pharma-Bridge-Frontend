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

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:   { bg: '#ecfdf5', text: '#065f46', dot: '#10b981' },
  HasBids:   { bg: '#eff6ff', text: '#1e40af', dot: '#3b82f6' },
  Closed:    { bg: '#f5f3ff', text: '#6d28d9', dot: '#8b5cf6' },
  Cancelled: { bg: '#fff1f2', text: '#9f1239', dot: '#f43f5e' },
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
      <div className="flex flex-col h-full space-y-5 p-6 bg-white">
        <div className="w-full h-48 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-7 bg-slate-100 rounded-xl w-3/4 animate-pulse mt-4" />
        <div className="h-4 bg-slate-100 rounded-xl w-1/2 animate-pulse" />
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-slate-100 rounded-xl w-full animate-pulse" />
          <div className="h-4 bg-slate-100 rounded-xl w-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4 bg-white">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
          <X className="w-8 h-8 text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Failed to load details</h3>
          <p className="text-sm text-slate-500 mt-1">The request might have been removed or expired.</p>
        </div>
        <Button variant="outline" onClick={onClose} className="mt-4 rounded-xl">Close</Button>
      </div>
    );
  }

  const isExpired = new Date(request.expiresAt).getTime() < new Date().getTime();
  const canBid = !isExpired && (request.status === 'Pending' || request.status === 'HasBids');
  const cfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.Pending;

  return (
    <div className="flex flex-col h-full bg-white">
      <SheetHeader className="px-6 py-5 border-b border-slate-100 shrink-0 text-left bg-slate-50/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-650 flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)' }}>
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-lg font-black text-slate-900 leading-tight">
                {request.medicineName}
              </SheetTitle>
              <SheetDescription className="text-xs font-semibold text-slate-400 mt-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Posted {formatDate(request.createdAt)}
              </SheetDescription>
            </div>
          </div>
          <span
            className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5"
            style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: 'transparent' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
            {request.status}
          </span>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative group flex items-center justify-center">
            {request.imageUrl ? (
              <img
                src={request.imageUrl}
                alt="Prescription"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-450 p-6">
                <HeartPulse className="w-10 h-10 mb-2 text-sky-400" />
                <span className="text-xs font-bold text-slate-400">No Prescription Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Delivery Area
              </h4>
              <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {request.deliveryArea}
              </p>
            </div>

            {request.patientNotes && (
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-violet-500" />
                  Patient Notes
                </h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap font-medium">
                  {request.patientNotes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 text-amber-600 mb-1 font-bold text-xs uppercase tracking-wide">
                  <Flame className="w-4 h-4" />
                  Bids Placed
                </div>
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  {request.bidsCount} <span className="text-xs font-semibold text-slate-400">offers</span>
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isExpired ? 'bg-slate-50 border-slate-200' : 'bg-sky-50/30 border-sky-100'}`}>
                <div className={`flex items-center gap-2 mb-1 font-bold text-xs uppercase tracking-wide ${isExpired ? 'text-slate-500' : 'text-sky-600'}`}>
                  <Clock className="w-4 h-4" />
                  Time Remaining
                </div>
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  {isExpired ? 'Expired' : getRelativeTime(request.expiresAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        <Button
          className="w-full h-11 text-xs font-bold rounded-xl transition-all"
          style={canBid
            ? { background: 'linear-gradient(135deg,#0284c7,#0369a1)', color: '#ffffff', boxShadow: '0 2px 8px rgba(3,105,161,0.25)' }
            : { backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }}
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
            <div style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <HeartPulse className="w-6 h-6" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: '#0f172a' }}>Nearby Requests</h1>
              <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>Browse patient prescriptions in your area.</p>
            </div>
          </div>

          {/* Count Badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm bg-white border"
            style={{ borderColor: '#e2e8f0' }}
          >
            <span className="text-3xl font-black tabular-nums" style={{ color: '#0f172a' }}>{totalCount}</span>
            <span className="text-xs font-semibold leading-tight" style={{ color: '#94a3b8' }}>
              Nearby<br />Requests
            </span>
          </div>
        </div>

        {/* ── Filter Toolbar Panel ── */}
        <div className="bg-white border rounded-2xl shadow-sm" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            
            {/* Status Tabs Navigation */}
            <div className="flex flex-wrap p-1 rounded-xl gap-1" style={{ backgroundColor: '#f8fafc' }}>
              {STATUS_TABS.map((tab) => {
                const isActive = status === tab.value;
                const cfg = STATUS_CONFIG[tab.value];
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusTabChange(tab.value)}
                    style={isActive ? { backgroundColor: '#0f172a', color: '#ffffff' } : { color: '#64748b' }}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5"
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

            {/* Actions & Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border shadow-sm transition-colors"
                style={{
                  backgroundColor: showFilters ? '#f8fafc' : '#ffffff',
                  borderColor: '#e2e8f0',
                  color: showFilters ? '#0f172a' : '#64748b',
                }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
              {(searchValue || status !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                  style={{ color: '#e11d48', backgroundColor: '#fff1f2' }}
                >
                  <FilterX className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search inputs expandable */}
          {showFilters && (
            <div className="px-4 pb-4 border-t pt-4" style={{ borderColor: '#f1f5f9' }}>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search by medicine name, ingredients..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-8 h-9 text-xs rounded-xl border"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' }}
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
                <Card key={i} className="bg-white rounded-2xl border p-6 animate-pulse" style={{ borderColor: '#f1f5f9', height: '210px' }}>
                  <div className="h-4 rounded-lg w-1/3 mb-4" style={{ backgroundColor: '#f1f5f9' }} />
                  <div className="h-8 rounded-xl w-2/3 mb-4" style={{ backgroundColor: '#f8fafc' }} />
                  <div className="h-3 rounded w-full mb-2" style={{ backgroundColor: '#f1f5f9' }} />
                  <div className="h-10 rounded-xl w-full mt-auto" style={{ backgroundColor: '#f1f5f9' }} />
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border bg-rose-50" style={{ borderColor: '#fecdd3' }}>
              <p className="font-bold" style={{ color: '#9f1239' }}>Failed to load requests. Please try again.</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 bg-white rounded-2xl border-2 border-dashed" style={{ borderColor: '#e2e8f0' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f0f9ff' }}>
                <HeartPulse className="w-7 h-7" style={{ color: '#0ea5e9' }} />
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#0f172a' }}>No Requests Found</h3>
              <p className="text-sm text-center max-w-xs" style={{ color: '#94a3b8' }}>
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
                      className="bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                      style={{ borderColor: '#f1f5f9' }}
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
                            <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>Request #{request.id}</span>
                          </div>
                          
                          <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                            style={{ backgroundColor: cfg.bg, color: cfg.text }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
                            {request.status}
                          </span>
                        </div>

                        {/* Medicine Name */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#cbd5e1' }}>Medicine Name</p>
                          <h3
                            className="text-lg font-black tracking-tight line-clamp-2"
                            style={{ color: isExpired ? '#94a3b8' : '#0f172a' }}
                          >
                            {request.medicineName}
                          </h3>
                        </div>

                        {/* Delivery Area */}
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#10b981' }} />
                          <span className="truncate" title={request.deliveryArea}>{request.deliveryArea}</span>
                        </div>

                        {/* Bids placed count if any */}
                        {request.bidsCount > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full self-start" style={{ color: '#92400e', backgroundColor: '#fef3c7' }}>
                            <Flame className="w-3.5 h-3.5" />
                            {request.bidsCount} Bid{request.bidsCount !== 1 ? 's' : ''} Placed
                          </div>
                        )}

                        {/* Date & Time info */}
                        <div className="flex items-center justify-between text-[11px] pt-3 border-t mt-auto" style={{ borderColor: '#f1f5f9', color: '#94a3b8' }}>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(request.createdAt)}
                          </span>
                          <span
                            className="flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded-full"
                            style={isExpired
                              ? { color: '#64748b', backgroundColor: '#f1f5f9' }
                              : { color: '#0369a1', backgroundColor: '#e0f2fe' }}
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
                        className="flex items-center justify-between px-6 py-4 w-full text-left transition-all border-t hover:opacity-85 active:scale-[0.99]"
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
                    onClick={() => handlePageChange(Math.max(1, pageIndex - 1))}
                    disabled={pageIndex === 1}
                    className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all disabled:opacity-40"
                    style={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#475569' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className="w-9 h-9 rounded-xl text-xs font-bold border transition-all"
                      style={pageIndex === pageNum
                        ? { backgroundColor: '#0f172a', color: '#fff', borderColor: '#0f172a' }
                        : { backgroundColor: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, pageIndex + 1))}
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

      {/* Details Sheet */}
      <Sheet open={!!activeRequestId} onOpenChange={(isOpen) => !isOpen && setActiveRequestId(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l-0 sm:border-l sm:rounded-l-3xl shadow-2xl">
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