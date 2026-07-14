import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, AlertCircle } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import { usePatientRequestsQuery } from '../hooks/usePrescriptionRequestQueries';
import { RequestStatus } from '../types';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';
import { useNavigate } from 'react-router-dom';

const STATUS_TABS: { label: string; value: RequestStatus | '' }[] = [
  { label: 'All',       value: ''          },
  { label: 'Pending',   value: 'Pending'   },
  { label: 'Has Bids',  value: 'HasBids'   },
  { label: 'Closed',    value: 'Closed'    },
  { label: 'Cancelled', value: 'Cancelled' },
];

export default function RequestsPage() {
  const [status, setStatus] = useState<RequestStatus | ''>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // خلينا الـ pageSize بـ 9 عشان تظبط على الـ Grid (3 عواميد)
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 9 });
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => { 
      setDebouncedSearch(search); 
      setPageIndex(1); 
    }, 500);
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
    <div className="max-w-[1440px] mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans transition-colors duration-300">
      
      {/* Header Section & Total Count Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[40px] font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">My Requests</h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg">Track your prescription requests and pharmacy offers.</p>
        </div>
        
        {/* Total Count Badge (From Dev, Styled for UI) */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <span className="text-4xl font-black text-[#009ADA] tabular-nums">{totalCount}</span>
          <span className="text-sm font-semibold leading-tight text-gray-500 dark:text-slate-400">
            Total<br />Requests
          </span>
        </div>
      </div>

      {/* Search & Filters Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-grow max-w-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#009ADA] focus:border-[#009ADA] transition-all text-gray-900 dark:text-white dark:placeholder-slate-500"
            placeholder="Search by ID or Medicine Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                status === tab.value 
                  ? 'bg-[#009ADA] text-white shadow-sm' 
                  : 'bg-white dark:bg-[#0f172a] text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-slate-800 p-6 animate-pulse min-h-[250px]">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-2xl shrink-0" />
                 <div className="w-16 h-6 bg-gray-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="space-y-3 mb-6">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-3xl border border-red-100">
          <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
          <p className="text-lg font-bold text-red-700">Failed to load requests.</p>
          <p className="text-red-500 text-sm mt-1">Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* New Request Placeholder Card */}
            {pageIndex === 1 && status === '' && search === '' && (
              <article 
                onClick={() => navigate('/requests/new')}
                className="bg-gray-50 dark:bg-[#0b0f19] border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center p-8 group cursor-pointer hover:bg-[#009ADA]/5 hover:border-[#009ADA]/30 transition-all min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 flex items-center justify-center text-[#009ADA] mb-4 group-hover:scale-110 group-hover:bg-[#009ADA] group-hover:text-white transition-all shadow-sm">
                  <Plus className="w-8 h-8" />
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-[#009ADA] transition-colors">New Request</p>
                <p className="text-gray-500 dark:text-slate-400 text-center mt-2 px-4 text-base">Submit a new prescription to receive offers.</p>
              </article>
            )}

            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}

            {/* Empty State */}
            {requests.length === 0 && (pageIndex !== 1 || status !== '' || search !== '') && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0f172a] rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                <div className="w-20 h-20 bg-gray-50 dark:bg-[#0b0f19] rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-gray-400 dark:text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No requests found</h3>
                <p className="text-gray-500 dark:text-slate-400 text-base">
                  {status !== '' 
                    ? `You don't have any ${status.toLowerCase()} requests.`
                    : "Try adjusting your search criteria."}
                </p>
              </div>
            )}
          </div>

          {/* Pagination (From Dev) */}
          {totalCount > pageSize && (
            <div className="mt-12 flex justify-center">
              <AppPagination
                totalCount={totalCount}
                currentPage={pageIndex}
                pageSize={pageSize}
                onPageChange={setPageIndex}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}