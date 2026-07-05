import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetNearbyRequestsQuery, useGetRequestDetailsForPharmacyQuery } from '../api/pharmacyRequests';
import { Search, MapPin, Clock, Flame, Image as ImageIcon, ChevronLeft, ChevronRight, X, HeartPulse, ListTodo, FilterX } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds <= 0) return 'Expired';
  
  if (diffInSeconds < 3600) return `Expires in ${Math.floor(diffInSeconds / 60)} mins`;
  if (diffInSeconds < 86400) return `Expires in ${Math.floor(diffInSeconds / 3600)} hours`;
  return `Expires in ${Math.floor(diffInSeconds / 86400)} days`;
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

function RequestDetailsSheetContent({ id, onClose }: { id: number, onClose: () => void }) {
  const navigate = useNavigate();
  const { data: request, isLoading, isError } = useGetRequestDetailsForPharmacyQuery(id);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full space-y-4 p-6">
        <div className="w-full h-48 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse mt-4" />
        <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
          <X className="w-8 h-8 text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Failed to load details</h3>
          <p className="text-sm text-slate-500 mt-1">The request might have been removed or expired.</p>
        </div>
        <Button variant="outline" onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  const isExpired = new Date(request.expiresAt).getTime() < new Date().getTime();
  const canBid = !isExpired && request.status === 'Pending';

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 py-4 border-b border-slate-100 shrink-0 text-left">
        <div className="flex items-start justify-between gap-4">
          <div>
            <SheetTitle className="text-xl font-bold text-slate-900 leading-tight">
              {request.medicineName}
            </SheetTitle>
            <SheetDescription className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Posted on {formatDate(request.createdAt)}
            </SheetDescription>
          </div>
          <Badge variant="outline" className={`shrink-0 font-bold px-2.5 py-0.5 border ${
            request.status === 'Pending' ? 'bg-teal-50 text-teal-700 border-teal-200' : 
            request.status === 'HasBids' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            {request.status}
          </Badge>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative group flex items-center justify-center">
            {request.imageUrl ? (
              <img 
                src={request.imageUrl} 
                alt="Prescription" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <HeartPulse className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-sm font-medium">No Prescription Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                Delivery Area
              </h4>
              <p className="text-base text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {request.deliveryArea}
              </p>
            </div>

            {request.patientNotes && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-teal-600" />
                  Patient Notes
                </h4>
                <p className="text-base text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                  {request.patientNotes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center gap-2 text-orange-600 mb-1 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  Competition
                </div>
                <p className="text-lg font-black text-slate-900">
                  {request.bidsCount} <span className="text-sm font-medium text-slate-500">Bids</span>
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isExpired ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-blue-50/50 border-blue-100 text-blue-700'}`}>
                <div className="flex items-center gap-2 mb-1 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  Time Left
                </div>
                <p className={`text-sm font-black ${isExpired ? 'text-slate-600' : 'text-slate-900'}`}>
                  {isExpired ? 'Expired' : getRelativeTime(request.expiresAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        <Button 
          className={`w-full h-12 text-base font-bold transition-all shadow-sm ${
            canBid 
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 active:scale-[0.98]' 
              : 'bg-slate-200 text-slate-500 hover:bg-slate-200 cursor-not-allowed'
          }`}
          disabled={!canBid}
          onClick={() => {
            onClose();
            navigate(`/pharmacy/requests/${request.id}/bid`, { state: { requestData: request } });
          }}
        >
          {canBid ? 'Submit Bid' : 'Bidding Closed'}
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

  // Debounced search state
  const [searchValue, setSearchValue] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (searchValue !== currentSearch) {
        const newParams = new URLSearchParams(searchParams);
        if (searchValue) newParams.set('search', searchValue);
        else newParams.delete('search');
        newParams.set('page', '1'); // Reset to page 1 on search change
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

  const requests = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleStatusChange = (val: string | null) => {
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">All Requests</h1>
        <p className="text-slate-500 mt-2 font-medium">Browse and filter through all patient requests available in your area.</p>
      </div>

      {/* Advanced Filter Bar */}
      <Card className="mb-8 border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-6 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row items-end gap-4">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Search</label>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by medicine name..." 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9 h-11 bg-white border-slate-200 rounded-xl focus-visible:ring-teal-500 w-full shadow-sm"
                />
              </div>
            </div>

            <div className="w-full lg:w-48 space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Status</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl font-medium focus:ring-teal-500 shadow-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="HasBids">Has Bids</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>



            <Button 
              variant="ghost" 
              onClick={handleClearFilters}
              className="h-11 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl font-bold px-4 w-full lg:w-auto shrink-0"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid Content */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-slate-100 shadow-sm animate-pulse rounded-2xl">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-6" />
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                    <div className="h-8 bg-slate-200 rounded w-1/3" />
                  </div>
                </CardContent>
                <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                  <div className="h-10 bg-slate-200 rounded-lg w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-rose-50 rounded-3xl border border-rose-100">
            <X className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-rose-900">Failed to load requests</h3>
            <p className="text-rose-600 mt-2 font-medium">Please check your connection and try again.</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <ListTodo className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Requests Found</h3>
            <p className="text-slate-500 text-center max-w-sm font-medium">
              We couldn't find any patient requests matching your advanced filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {requests.map((request) => {
                const isExpired = new Date(request.expiresAt).getTime() < new Date().getTime();
                const canBid = !isExpired && request.status === 'Pending';

                return (
                  <Card 
                    key={request.id} 
                    className={`border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col ${isExpired ? 'bg-slate-50/50' : 'bg-white'}`}
                  >
                    <CardContent className="p-6 flex-1 flex flex-col cursor-pointer" onClick={() => setActiveRequestId(request.id)}>
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <h3 className={`text-lg font-bold leading-tight line-clamp-2 ${isExpired ? 'text-slate-500' : 'text-slate-900'}`}>
                          {request.medicineName}
                        </h3>
                        <Badge variant="outline" className={`shrink-0 font-bold px-2.5 py-0.5 border ${
                          request.status === 'Pending' ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                          request.status === 'HasBids' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {request.status}
                        </Badge>
                      </div>

                      <div className="space-y-3 mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="truncate" title={request.deliveryArea}>{request.deliveryArea}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{formatDate(request.createdAt)}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${isExpired ? 'text-slate-500' : 'text-blue-600'}`}>
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>{isExpired ? 'Expired' : getRelativeTime(request.expiresAt)}</span>
                          </div>
                          
                          {request.bidsCount > 0 && (
                            <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                              <Flame className="w-3.5 h-3.5" />
                              {request.bidsCount} Bids
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        className="w-full rounded-xl font-bold bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                        onClick={() => setActiveRequestId(request.id)}
                      >
                        Details
                      </Button>
                      <Button 
                        className={`w-full rounded-xl font-bold shadow-sm transition-all ${
                          canBid 
                            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 active:scale-[0.98]' 
                            : 'bg-slate-200 text-slate-500 hover:bg-slate-200 cursor-not-allowed'
                        }`}
                        disabled={!canBid}
                        onClick={() => navigate(`/pharmacy/requests/${request.id}/bid`, { state: { requestData: request } })}
                      >
                        {canBid ? 'Bid' : 'Closed'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center pt-8 border-t border-slate-200 mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.max(1, pageIndex - 1))}
                  disabled={pageIndex === 1 || isLoading}
                  className="rounded-xl font-bold text-slate-600 hover:text-slate-900 border-slate-200 w-10 h-10 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageIndex === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`rounded-xl w-10 h-10 p-0 font-bold ${
                        pageIndex === pageNum 
                          ? 'bg-teal-600 hover:bg-teal-700 text-white border-transparent' 
                          : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.min(totalPages, pageIndex + 1))}
                  disabled={pageIndex === totalPages || isLoading}
                  className="rounded-xl font-bold text-slate-600 hover:text-slate-900 border-slate-200 w-10 h-10 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Sheet */}
      <Sheet open={!!activeRequestId} onOpenChange={(isOpen) => !isOpen && setActiveRequestId(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l-0 sm:border-l sm:rounded-l-2xl shadow-2xl">
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
