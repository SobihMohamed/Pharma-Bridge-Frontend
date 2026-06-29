import React, { useState, useEffect } from 'react';
import { FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import { usePatientRequestsQuery } from '../hooks/usePrescriptionRequestQueries';
import { RequestStatus } from '../types';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';

export default function RequestsPage() {
  const [status, setStatus] = useState<RequestStatus | ''>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 9 });

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search, setPageIndex]);

  // Handle status change
  const handleStatusChange = (newStatus: RequestStatus | '') => {
    setStatus(newStatus);
    setPageIndex(1); // Reset to page 1 on new filter
  };

  const { data, isLoading, isError } = usePatientRequestsQuery({
    Status: status,
    Search: debouncedSearch,
    PageIndex: pageIndex,
    PageSize: pageSize
  });

  const requests = data?.data || [];
  const totalCount = data?.totalCount || 0;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-500">Track your prescription requests and pharmacy offers.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Search by ID or Medicine Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0 items-center">
          {(['', 'Pending', 'HasBids', 'Closed', 'Cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s as RequestStatus | '')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                status === s 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s === '' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-600">
          Failed to load requests. Please try again later.
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No requests found</h3>
          <p className="text-gray-500 text-sm">
            {status !== '' 
              ? `You don't have any ${status.toLowerCase()} requests.`
              : "You haven't made any prescription requests yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>

          {/* Pagination */}
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
  );
}
