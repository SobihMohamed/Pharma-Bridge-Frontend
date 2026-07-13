import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus } from 'lucide-react';
import RequestCard from '../components/RequestCard';
import { usePatientRequestsQuery } from '../hooks/usePrescriptionRequestQueries';
import { RequestStatus } from '../types';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';
import { useNavigate } from 'react-router-dom';

export default function RequestsPage() {
  const [status, setStatus] = useState<RequestStatus | ''>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 8 });
  const navigate = useNavigate();

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
    <div className="max-w-[1440px] mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-[40px] font-extrabold text-gray-900 mb-2 tracking-tight">My Requests</h1>
        <p className="text-gray-500 text-lg">Track your prescription requests and pharmacy offers.</p>
      </div>

      {/* Search & Filters Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-grow max-w-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009ADA] focus:border-[#009ADA] transition-all text-gray-900"
            placeholder="Search by ID or Medicine Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['', 'Pending', 'HasBids', 'Closed', 'Cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s as RequestStatus | '')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                status === s 
                  ? 'bg-[#009ADA] text-white shadow-sm' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s === '' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-200 p-6 animate-pulse min-h-[250px]">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 bg-gray-200 rounded-2xl shrink-0" />
                 <div className="w-16 h-6 bg-gray-200 rounded-full" />
              </div>
              <div className="space-y-3 mb-6">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-600 font-medium bg-red-50 rounded-2xl">
          Failed to load requests. Please try again later.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}

            {/* New Request Placeholder Card */}
            {pageIndex === 1 && (
              <article 
                onClick={() => navigate('/requests/new')}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center p-8 group cursor-pointer hover:bg-gray-100 transition-colors min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#009ADA] mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Plus className="w-8 h-8" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">New Request</p>
                <p className="text-gray-500 text-center mt-2 px-4 text-base">Submit a new prescription to receive offers from local pharmacies.</p>
              </article>
            )}

            {requests.length === 0 && pageIndex === 1 && (
              <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
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
            )}
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
