import React, { useState, useEffect } from 'react';
import { Package, Clock, Search, FilterX, CalendarDays, Receipt, AlertCircle } from 'lucide-react';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';
import { useGetPharmacyBidsQuery, BidDto } from '../api/bidding';
import { useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Simple debounce hook for the search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function MyBidsPage() {
  const navigate = useNavigate();
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 9 });
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  
  // Get active pharmacy ID with exact extraction fallback to 1 as requested for testing
  const { data: profile } = useMyPharmacyProfileQuery();
  const rawId = (profile as any)?.data?.id || (profile as any)?.id;
  const pharmacyId = rawId ? Number(rawId) : 1; // Fallback to 1

  // Fetch paginated bids
  const { data: paginatedBids, isLoading, isError } = useGetPharmacyBidsQuery(pharmacyId, {
    Status: statusFilter === 'All' ? undefined : statusFilter,
    Search: debouncedSearch || undefined,
    FromDate: fromDate || undefined,
    ToDate: toDate || undefined,
    PageIndex: pageIndex,
    PageSize: pageSize
  });

  const bids = paginatedBids?.data || [];
  const totalCount = paginatedBids?.totalCount || 0;

  // Handlers
  const handleStatusChange = (value: string | null) => {
    if (!value) return;
    setStatusFilter(value);
    setPageIndex(1);
  };

  const handleClearFilters = () => {
    setStatusFilter('All');
    setSearchInput('');
    setFromDate('');
    setToDate('');
    setPageIndex(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <span className="px-3 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-700 border border-green-200">Accepted</span>;
      case 'Rejected':
        return <span className="px-3 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-700 border border-red-200">Rejected</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-700 border border-gray-200">Cancelled</span>;
      case 'Pending':
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-md bg-yellow-100 text-yellow-700 border border-yellow-200">Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-8 h-8 text-teal-600" />
          My Submitted Bids
        </h1>
        <p className="text-base text-gray-500 mt-2">
          Track and manage your prescription offers to patients.
        </p>
      </div>
        
      {/* Advanced Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4 sm:space-y-0 sm:flex sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPageIndex(1); }}
            placeholder="Search by Request ID or Item Name..." 
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-36">
            <Input 
              type="date" 
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setPageIndex(1); }}
              className="bg-gray-50 border-gray-200 text-sm"
              title="From Date"
            />
          </div>
          <span className="text-gray-400 text-sm">-</span>
          <div className="relative flex-1 sm:w-36">
            <Input 
              type="date" 
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setPageIndex(1); }}
              className="bg-gray-50 border-gray-200 text-sm"
              title="To Date"
            />
          </div>
        </div>

        {(statusFilter !== 'All' || searchInput || fromDate || toDate) && (
          <Button 
            variant="ghost" 
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-red-600 w-full sm:w-auto shrink-0"
          >
            <FilterX className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-64 animate-pulse flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-100 rounded-full w-20"></div>
              </div>
              <div className="h-12 bg-gray-50 rounded-lg w-1/2"></div>
              <div className="flex-1 space-y-2 mt-4">
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-4/5"></div>
              </div>
              <div className="mt-auto h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-12 text-center rounded-2xl border border-red-100 flex flex-col items-center">
          <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
          <h3 className="text-lg font-semibold">Failed to load bids</h3>
          <p className="text-red-500/80">There was an error communicating with the server. Please try again.</p>
        </div>
      ) : bids.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-dashed border-gray-300 flex flex-col items-center">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bids Found</h3>
          <p className="text-gray-500 text-sm max-w-md mb-6">
            {statusFilter !== 'All' || searchInput || fromDate || toDate
              ? "We couldn't find any bids matching your current filters. Try clearing them to see more."
              : "You haven't submitted any bids yet. Head over to the Live Radar to find nearby prescriptions and submit your first offer."}
          </p>
          {(statusFilter !== 'All' || searchInput || fromDate || toDate) ? (
            <Button onClick={handleClearFilters} variant="outline" className="border-gray-300 text-gray-700">
              Clear Filters
            </Button>
          ) : (
            <Button onClick={() => navigate('/pharmacy/live-requests')} className="bg-teal-600 hover:bg-teal-700 text-white">
              Go to Live Radar
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.map((bid: BidDto) => (
            <div 
              key={bid.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-teal-200 transition-all flex flex-col group"
            >
              
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-gray-500">
                    <Receipt className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Bid #{bid.id}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">
                    {bid.totalPrice?.toFixed(2)} <span className="text-sm font-medium text-gray-500">EGP</span>
                  </p>
                </div>
                {getStatusBadge(bid.status)}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <span className="text-lg">💊</span>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{bid.bidItems?.length || 0}</span> Item(s) included
                    {bid.bidItems?.length > 0 && <span className="text-gray-500"> (e.g., {bid.bidItems[0].itemName})</span>}
                  </p>
                </div>
              </div>
              
              {/* Card Footer / Action */}
              <div className="px-6 pb-6 space-y-4">
                <div className="flex justify-between items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(bid.submittedAt))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {bid.deliveryTimeInMinutes}m
                  </div>
                </div>

                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pharmacy/bids/${bid.id}`);
                  }}
                  className="w-full bg-gray-900 hover:bg-teal-600 text-white transition-colors group-hover:shadow-md h-11"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Container */}
      {totalCount > pageSize && (
        <div className="pt-4 flex justify-center">
          <AppPagination 
            totalCount={totalCount} 
            currentPage={pageIndex} 
            pageSize={pageSize} 
            onPageChange={setPageIndex} 
          />
        </div>
      )}
    </div>
  );
}
