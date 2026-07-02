import React, { useState, useEffect } from 'react';
import { Package, Search, FilterX, Clock, Receipt, ExternalLink, Store } from 'lucide-react';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';
import { useGetMyOrdersQuery } from '../api/orders';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

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

export default function OrdersPage() {
  const navigate = useNavigate();
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 10 });
  
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const { data: paginatedOrders, isLoading, isError } = useGetMyOrdersQuery({
    Status: statusFilter === 'All' ? undefined : statusFilter,
    Search: debouncedSearch || undefined,
    FromDate: fromDate || undefined,
    ToDate: toDate || undefined,
    PageIndex: pageIndex,
    PageSize: pageSize
  });

  const orders = paginatedOrders?.data || [];
  const totalCount = paginatedOrders?.totalCount || 0;

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
      case 'Pending':
      case 'Accepted':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Accepted</Badge>;
      case 'Preparing':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">Preparing</Badge>;
      case 'InTransit':
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200">In Transit</Badge>;
      case 'Completed':
      case 'Delivered':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">Completed</Badge>;
      case 'Cancelled':
      case 'Returned':
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-8 h-8 text-teal-600" />
          My Orders
        </h1>
        <p className="text-base text-gray-500 mt-2">
          Track and manage your pharmacy orders.
        </p>
      </div>
        
      {/* Filters Board */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPageIndex(1); }}
                placeholder="Search by Pharmacy Name or Order ID..." 
                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Preparing">Preparing</SelectItem>
                  <SelectItem value="InTransit">In Transit</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input 
                type="date" 
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPageIndex(1); }}
                className="bg-slate-50 border-slate-200 text-sm flex-1 sm:w-36"
                title="From Date"
              />
              <span className="text-gray-400 text-sm">-</span>
              <Input 
                type="date" 
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPageIndex(1); }}
                className="bg-slate-50 border-slate-200 text-sm flex-1 sm:w-36"
                title="To Date"
              />
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
        </CardContent>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-24 bg-slate-50 border-slate-100" />
          ))}
        </div>
      ) : isError ? (
        <Card className="bg-red-50 border-red-100 text-center py-12">
          <CardContent>
            <p className="text-red-600 font-semibold mt-6">Failed to load orders. Please try again later.</p>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="bg-white border-dashed border-slate-300 text-center py-16">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-500 max-w-md">
              We couldn't find any orders matching your current criteria.
            </p>
            {(statusFilter !== 'All' || searchInput || fromDate || toDate) && (
              <Button onClick={handleClearFilters} variant="outline" className="mt-6 border-slate-300">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card 
              key={order.id} 
              className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 group"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">Order #{order.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-sm text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(order.createdAt))}
                      </span>
                    </div>
                    <div className="text-slate-700 flex items-center gap-1.5 font-medium">
                      <Store className="w-4 h-4 text-teal-600" />
                      {order.pharmacyName}
                    </div>
                  </div>

                  {/* Middle: Status */}
                  <div className="flex md:justify-center shrink-0 w-40">
                    {getStatusBadge(order.orderStatus)}
                  </div>

                  {/* Right: Price & Payment */}
                  <div className="text-left md:text-right shrink-0 w-32 flex flex-col justify-center">
                    <div className="text-xl font-black text-slate-900">
                      {order.amount.toFixed(2)} <span className="text-sm font-medium text-slate-500">EGP</span>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1 flex items-center gap-1 md:justify-end">
                      <Receipt className="w-3.5 h-3.5" />
                      {order.paymentStatus}
                    </div>
                  </div>
                  
                  {/* Action Icon */}
                  <div className="hidden md:flex items-center justify-center text-slate-300 group-hover:text-teal-600 transition-colors shrink-0 pl-2">
                     <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
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
