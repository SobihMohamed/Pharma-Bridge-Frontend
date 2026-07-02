import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar as CalendarIcon, Clock, User, 
  ChevronRight, PackageOpen 
} from 'lucide-react';
import { useGetPharmacyOrdersQuery } from '../api/orders';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderSummaryDto } from '@/features/orders/api/orders';

const TABS = [
  { label: 'All Orders', value: 'all' },
  { label: 'Preparing', value: 'Preparing' },
  { label: 'In Transit', value: 'InTransit' },
  { label: 'Completed', value: 'Completed' },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 12;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPageIndex(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Handle Tab Change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPageIndex(1); // Reset pagination on tab change
  };

  const { data, isLoading, isError } = useGetPharmacyOrdersQuery({
    Status: activeTab !== 'all' ? activeTab : undefined,
    Search: debouncedSearch || undefined,
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const orders = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Accepted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Accepted</Badge>;
      case 'Preparing':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Preparing</Badge>;
      case 'InTransit':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">In Transit</Badge>;
      case 'Completed':
      case 'Delivered':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Completed</Badge>;
      case 'Cancelled':
      case 'Returned':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Orders</h1>
        <p className="text-slate-500 mt-1">Manage fulfillments and track deliveries.</p>
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-4">
        {/* Top Navigation */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm h-auto flex flex-wrap gap-1 justify-start">
            {TABS.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="rounded-lg px-4 py-2 font-medium data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Secondary Filters Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by Order ID or Patient Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-teal-500 rounded-lg w-full"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto bg-slate-50 border-slate-200 text-slate-600 rounded-lg">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Grid Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse">
              <div className="flex justify-between">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
              <div className="h-10 bg-slate-100 rounded-lg w-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Failed to load orders</h3>
          <p className="text-slate-500 mt-1">Please try again later.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No orders found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            {searchQuery 
              ? `No results matching "${searchQuery}" in ${TABS.find(t => t.value === activeTab)?.label}.`
              : `There are currently no orders in the ${TABS.find(t => t.value === activeTab)?.label} status.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order: OrderSummaryDto) => (
            <Card key={order.id} className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col bg-white overflow-hidden">
              <CardHeader className="p-5 pb-0 border-b border-slate-50 mb-4 flex flex-row items-center justify-between">
                <div className="font-extrabold text-slate-900 text-lg">#{order.id}</div>
                {getStatusBadge(order.orderStatus)}
              </CardHeader>
              
              <CardContent className="p-5 pt-0 space-y-4 flex-1">
                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base">{order.patientName}</p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Financials */}
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Amount</span>
                    <span className="text-xl font-black text-teal-600">{order.amount.toFixed(2)} <span className="text-xs text-teal-600/70 font-bold">EGP</span></span>
                  </div>
                  <Badge variant="outline" className={`px-2 py-1 ${order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0 mt-auto">
                <Button 
                  onClick={() => navigate(`/pharmacy/orders/${order.id}`)}
                  className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold rounded-xl h-11 transition-colors group"
                >
                  Manage Order
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm sm:px-6 mt-8">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-bold">{(pageIndex - 1) * pageSize + 1}</span> to <span className="font-bold">{Math.min(pageIndex * pageSize, totalCount)}</span> of <span className="font-bold">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                  disabled={pageIndex === 1}
                  className="rounded-l-md rounded-r-none border-slate-200 text-slate-600"
                >
                  Previous
                </Button>
                <div className="px-4 py-2 border-t border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-700">
                  Page {pageIndex} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                  disabled={pageIndex === totalPages}
                  className="rounded-r-md rounded-l-none border-slate-200 text-slate-600"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
          
          {/* Mobile Pagination */}
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setPageIndex(p => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
              className="border-slate-200 text-slate-600"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
              disabled={pageIndex === totalPages}
              className="border-slate-200 text-slate-600"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
