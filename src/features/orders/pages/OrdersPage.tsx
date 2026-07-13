import React, { useState, useEffect, useRef } from 'react';
import { Package, Search, ChevronDown, Calendar, Store, CheckCircle, Clock, ExternalLink, LayoutGrid, BadgeCheck, ClipboardList, Truck, XCircle } from 'lucide-react';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';
import { useGetMyOrdersQuery } from '../api/orders';
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

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses', icon: LayoutGrid },
  { value: 'Accepted', label: 'Accepted', icon: BadgeCheck },
  { value: 'Pending', label: 'Pending', icon: ClipboardList },
  { value: 'Delivered', label: 'Delivered', icon: Truck },
  { value: 'Cancelled', label: 'Cancelled', icon: XCircle },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const { pageIndex, setPageIndex, pageSize } = usePagination({ initialPageSize: 10 });
  
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Accepted':
        return 'bg-[#009ADA]/10 text-[#009ADA]';
      case 'Preparing':
        return 'bg-amber-100 text-amber-800';
      case 'InTransit':
        return 'bg-indigo-100 text-indigo-800';
      case 'Completed':
      case 'Delivered':
        return 'bg-gray-200/50 text-gray-600';
      case 'Cancelled':
      case 'Returned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    if (status === 'Paid') {
      return <CheckCircle className="w-4 h-4 text-[#009ADA]" />;
    }
    return <Clock className="w-4 h-4 text-[#895100]" />;
  };

  const getPaymentStatusTextColor = (status: string) => {
    if (status === 'Paid') return 'text-[#009ADA]';
    return 'text-[#895100]';
  };

  const ActiveStatusIcon = STATUS_OPTIONS.find(o => o.value === statusFilter)?.icon || LayoutGrid;
  const activeStatusLabel = STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || 'All Statuses';

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 min-h-[calc(100vh-160px)] font-sans">
      {/* Header Section */}
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#009ADA]/10 p-2 rounded-xl">
            <Package className="text-[#009ADA] w-6 h-6" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">My Orders</h1>
        </div>
        <p className="text-gray-500 text-base">Track and manage your pharmacy orders with transparency and precision.</p>
      </div>
        
      {/* Filter & Search Bento Section */}
      <section className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPageIndex(1); }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#009ADA] focus:border-[#009ADA] transition-all text-gray-900"
              placeholder="Search by Pharmacy Name or Order ID..."
            />
          </div>
          
          {/* Status Filter Custom Dropdown */}
          <div className="w-full lg:w-56" ref={dropdownRef}>
            <div className="relative">
              <button 
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#009ADA] focus:outline-none text-gray-900"
              >
                <div className="flex items-center gap-2">
                  <ActiveStatusIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">{activeStatusLabel}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                  {STATUS_OPTIONS.map((option) => {
                    const isActive = statusFilter === option.value;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setPageIndex(1);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                          isActive 
                            ? 'bg-[#009ADA] text-[#001E2F]' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-[#001E2F]' : 'text-gray-500'}`} />
                          <span className={`font-semibold ${isActive ? 'text-[#001E2F]' : ''}`}>{option.label}</span>
                        </div>
                        {isActive && (
                          <div className="bg-[#001E2F] rounded-full p-0.5 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-[#009ADA] stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Date Range */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="relative w-full md:w-44">
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPageIndex(1); }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#009ADA] text-gray-900" 
              />
            </div>
            <span className="text-gray-400 hidden md:block">—</span>
            <div className="relative w-full md:w-44">
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPageIndex(1); }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#009ADA] text-gray-900" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-28 rounded-2xl bg-white border border-gray-200" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border-red-100 rounded-2xl text-center py-12">
          <p className="text-red-600 font-semibold mt-6">Failed to load orders. Please try again later.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 text-center py-16">
          <div className="flex flex-col items-center pt-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any orders matching your current criteria.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              onClick={() => navigate(`/orders/${order.id}`)}
              className={`group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#009ADA]/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${['Completed', 'Delivered', 'Cancelled'].includes(order.orderStatus) ? 'opacity-80 hover:opacity-100' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-500">Order #{order.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(order.createdAt))}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#85CBFD]/20 flex items-center justify-center text-[#006591]">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold leading-none text-gray-900">{order.pharmacyName}</h3>
                      <p className="text-xs text-gray-500 mt-1">Pharmacy</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-12">
                  <div className="flex flex-col items-start md:items-center">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusConfig(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex flex-col items-end w-24">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold text-gray-900">{order.amount.toFixed(2)}</span>
                      <span className="text-sm font-medium text-gray-500">EGP</span>
                    </div>
                    <div className={`flex items-center gap-1 ${getPaymentStatusTextColor(order.paymentStatus)}`}>
                      {getPaymentStatusIcon(order.paymentStatus)}
                      <span className="text-xs font-bold tracking-widest uppercase">{order.paymentStatus}</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-[#009ADA] group-hover:bg-[#009ADA] group-hover:text-white transition-all shrink-0">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="pt-8 flex justify-center">
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
