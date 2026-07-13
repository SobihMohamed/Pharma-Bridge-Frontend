import React, { useState, useEffect } from 'react';
import { FileText, Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import { usePatientRequestsQuery } from '../hooks/usePrescriptionRequestQueries';
import { RequestStatus } from '../types';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';

const STATUS_TABS: { label: string; value: RequestStatus | '' }[] = [
  { label: 'All',       value: ''          },
  { label: 'Pending',   value: 'Pending'   },
  { label: 'Has Bids',  value: 'HasBids'   },
  { label: 'Closed',    value: 'Closed'    },
  { label: 'Cancelled', value: 'Cancelled' },
];

const STATUS_DOT: Record<string, string> = {
  Pending:   '#eab308',
  HasBids:   '#3b82f6',
  Closed:    '#8b5cf6',
  Cancelled: '#f43f5e',
};

export default function RequestsPage() {
  const [status, setStatus]               = useState<RequestStatus | ''>('');
  const [search, setSearch]               = useState('');
  const [debouncedSearch, setDebounced]   = useState('');
  const [showSearch, setShowSearch]       = useState(false);
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 9 });

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPageIndex(1); }, 500);
    return () => clearTimeout(t);
  }, [search, setPageIndex]);

  const handleStatusChange = (newStatus: RequestStatus | '') => {
    setStatus(newStatus);
    setPageIndex(1);
  };

  const { data, isLoading, isError } = usePatientRequestsQuery({
    Status: status,
    Search: debouncedSearch,
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const requests   = data?.data || [];
  const totalCount = data?.totalCount || 0;

  return (
    <div className="min-h-screen p-6 font-sans" style={{ backgroundColor: '#F4F6FA' }}>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow"
              style={{ background: 'linear-gradient(135deg,#10b981,#0d9488)' }}
            >
              <FileText className="w-6 h-6" style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: '#0f172a' }}>My Requests</h1>
              <p className="text-sm" style={{ color: '#94a3b8' }}>Track your prescription requests and pharmacy offers.</p>
            </div>
          </div>

          {/* Count badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm"
            style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
          >
            <span className="text-3xl font-black tabular-nums" style={{ color: '#0f172a' }}>{totalCount}</span>
            <span className="text-xs font-semibold leading-tight" style={{ color: '#94a3b8' }}>
              Total<br />Requests
            </span>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">

            {/* Status tabs */}
            <div className="flex flex-wrap gap-1 p-1 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
              {STATUS_TABS.map(tab => {
                const isActive = status === tab.value;
                const dot = STATUS_DOT[tab.value as string];
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusChange(tab.value)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200"
                    style={isActive
                      ? { backgroundColor: '#0f172a', color: '#fff' }
                      : { color: '#64748b' }
                    }
                  >
                    {dot && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isActive ? '#ffffff88' : dot }}
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
                <input
                  type="text"
                  className="w-full pl-8 pr-3 h-9 text-xs rounded-xl border outline-none transition-all"
                  style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' }}
                  placeholder="Search by ID or medicine name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-6 animate-pulse" style={{ borderColor: '#f1f5f9', height: '180px' }}>
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: '#f1f5f9' }} />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 rounded-lg w-1/2" style={{ backgroundColor: '#f1f5f9' }} />
                    <div className="h-3 rounded w-1/3" style={{ backgroundColor: '#f8fafc' }} />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 rounded w-full" style={{ backgroundColor: '#f8fafc' }} />
                  <div className="h-3 rounded w-4/5" style={{ backgroundColor: '#f8fafc' }} />
                </div>
                <div className="h-9 rounded-xl w-full" style={{ backgroundColor: '#f1f5f9' }} />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border" style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}>
            <AlertCircle className="w-9 h-9 mb-2" style={{ color: '#f43f5e' }} />
            <p className="font-bold" style={{ color: '#9f1239' }}>Failed to load requests. Please try again.</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white rounded-2xl border-2 border-dashed" style={{ borderColor: '#e2e8f0' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#ecfdf5' }}>
              <FileText className="w-7 h-7" style={{ color: '#10b981' }} />
            </div>
            <p className="text-base font-bold mb-1" style={{ color: '#0f172a' }}>No Requests Found</p>
            <p className="text-sm text-center max-w-xs" style={{ color: '#94a3b8' }}>
              {status !== ''
                ? `You don't have any ${status.toLowerCase()} requests.`
                : "You haven't made any prescription requests yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {requests.map(req => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>

            {totalCount > pageSize && (
              <AppPagination
                totalCount={totalCount}
                currentPage={pageIndex}
                pageSize={pageSize}
                onPageChange={setPageIndex}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
