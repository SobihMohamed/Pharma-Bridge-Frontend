import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, AlertTriangle, Clock, Activity, FileText, ImageIcon, Store, Star, Receipt, Info, PackageOpen, Trash2, Loader2, XCircle, CheckCircle } from 'lucide-react';

import { useGetPatientRequestDetailsQuery } from '../hooks/usePrescriptionRequestQueries';
import { useCancelRequestMutation, useRespondToBidMutation } from '../hooks/usePrescriptionRequestMutations';
import CancelRequestDialog from '../components/CancelRequestDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const requestId = id ? parseInt(id, 10) : 0;

  // Real-time enabled query hook
  const { data: request, isLoading, isError } = useGetPatientRequestDetailsQuery(requestId);
  const { mutate: cancelRequest, isPending: isCancelling } = useCancelRequestMutation();
  const { mutate: respondToBid, isPending: isResponding } = useRespondToBidMutation();
  const [activeBidId, setActiveBidId] = useState<number | null>(null);

  const handleCancelRequest = () => {
    cancelRequest(requestId, {
      onSuccess: () => {
        setIsCancelDialogOpen(false);
        toast.success("Request cancelled successfully.");
        navigate('/requests');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="animate-pulse flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="w-48 h-6 bg-gray-200 rounded"></div>
            <div className="w-64 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-96 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="lg:col-span-8 h-96 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Request Not Found</h2>
        <p className="text-slate-500 max-w-md">
          The prescription request you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => navigate('/requests')} className="mt-4 bg-teal-600 hover:bg-teal-700">
          Back to My Requests
        </Button>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Awaiting Offers</Badge>;
      case 'HasBids':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Offers Available</Badge>;
      case 'Closed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyText = (expiresAt: string) => {
    const diffMs = new Date(expiresAt).getTime() - new Date().getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    
    if (mins <= 0) return "Expired";
    if (mins < 60) return `Expires in ${mins} mins`;
    const hours = Math.floor(mins / 60);
    return `Expires in ${hours} hr ${mins % 60} min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const canCancel = request.status === 'Pending' || request.status === 'HasBids';
  const bids = request.bids || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Row */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/requests')} 
          className="rounded-full shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Prescription Request</h1>
          <p className="text-sm text-slate-500 mt-0.5">Submitted on {formatDate(request.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Request Context */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Image Section */}
            {request.imageUrl ? (
              <div className="w-full h-64 bg-slate-100 relative group overflow-hidden">
                <img 
                  src={request.imageUrl} 
                  alt="Prescription" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                   <div className="flex items-center gap-2 text-white/95">
                     <Clock className="w-4 h-4" />
                     <span className="text-sm font-medium tracking-wide">{getUrgencyText(request.expiresAt)}</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-slate-50 flex flex-col items-center justify-center border-b border-slate-100">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-500">No image attached</span>
              </div>
            )}

            {/* Request Details */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 line-clamp-2">
                    {request.medicineName || "General Prescription"}
                  </h2>
                </div>
                <div className="shrink-0 pt-1">
                  {renderStatusBadge(request.status)}
                </div>
              </div>

              <div className="space-y-5 pt-2 border-t border-slate-100">
                <div className="flex gap-3 text-slate-600 mt-4">
                  <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Delivery Area</p>
                    <p className="text-sm font-medium text-slate-900">{request.deliveryArea || "Nearby"}</p>
                  </div>
                </div>

                {request.patientNotes && request.patientNotes.trim() !== '' && request.patientNotes.toLowerCase() !== 'null' && (
                  <div className="flex gap-3 text-slate-600">
                    <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">My Notes</p>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                        <p className="text-sm text-slate-700 italic">"{request.patientNotes}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Footer */}
            {canCancel && (
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                  onClick={() => setIsCancelDialogOpen(true)}
                >
                  Cancel Request
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Offers List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Offers Received ({request.bidsCount})
            </h2>
            
            {/* Live Indicator Pulse */}
            {(request.status === 'Pending' || request.status === 'HasBids') && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full shadow-sm">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </div>
                <span className="text-xs font-bold text-green-700 tracking-wide uppercase">Live</span>
              </div>
            )}
          </div>

          {bids.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center shadow-sm">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6 relative shadow-inner">
                <Activity className="w-8 h-8 text-teal-600" />
                <div className="absolute inset-0 border-[3px] border-teal-200 border-t-teal-600 rounded-full animate-spin opacity-50"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Waiting for pharmacies...</h3>
              <p className="text-slate-500 text-base max-w-md leading-relaxed">
                We have notified nearby pharmacies about your request. Relax, offers will appear here automatically in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bids.map((bid) => {
                const hasAlternatives = bid.bidItems.some(item => item.isAlternative);
                const subtotal = bid.bidItems.reduce((acc, item) => acc + item.lineTotal, 0);
                const calculatedDiscount = (subtotal + bid.deliveryFee) - bid.totalPrice;
                
                return (
                  <div key={bid.id} className={`rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden ${
                    bid.status === 'Rejected' ? 'opacity-75 grayscale-[20%] border-slate-200 bg-white' :
                    bid.status === 'Accepted' ? 'border-emerald-500 bg-emerald-50/30' :
                    'bg-white border-slate-200 hover:border-teal-300'
                  }`}>
                    <div className="flex flex-col md:flex-row justify-between">
                      
                      {/* Main Bid Content */}
                      <div className="flex-1 p-6 space-y-5">
                        
                        {/* Header Row */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                              <Store className="w-5 h-5 text-teal-600 shrink-0" />
                              {bid.pharmacyName}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1.5 text-sm">
                              {bid.pharmacyRating > 0 ? (
                                <>
                                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                  <span className="font-bold text-slate-700">{bid.pharmacyRating.toFixed(1)}</span>
                                </>
                              ) : (
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider py-0 px-1.5 h-5">New</Badge>
                              )}
                              <span className="text-slate-300 mx-1">•</span>
                              <span className="text-slate-500 font-medium">Offered at {new Date(bid.submittedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                            </div>
                          </div>
                          
                          {/* Mobile Pricing Top-Right */}
                          <div className="md:hidden text-right">
                            <span className="text-2xl font-black text-teal-600 tracking-tight">{bid.totalPrice.toFixed(2)}</span>
                            <span className="text-sm font-bold text-slate-400 ml-1">EGP</span>
                          </div>
                        </div>

                        {/* Nested Bid Items List */}
                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <PackageOpen className="w-4 h-4" />
                            Included Items ({bid.bidItems.length})
                          </div>
                          
                          <div className="space-y-3">
                            {bid.bidItems.map((item, idx) => (
                              <div key={idx} className="flex flex-col gap-2">
                                {/* Item Row */}
                                <div className="flex items-start justify-between text-sm">
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-slate-400 min-w-[24px]">{item.quantity}x</span>
                                    <span className={`font-medium ${item.isAlternative ? 'text-amber-700' : 'text-slate-900'}`}>
                                      {item.itemName}
                                    </span>
                                  </div>
                                  <div className="font-medium text-slate-900 shrink-0 ml-4">
                                    {item.lineTotal.toFixed(2)} <span className="text-slate-400 text-xs">EGP</span>
                                  </div>
                                </div>
                                
                                {/* Alternative Warning Box */}
                                {item.isAlternative && (
                                  <div className="ml-8 bg-amber-50 rounded-md border border-amber-200/60 p-2.5 text-sm text-amber-800 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold block mb-0.5">Alternative Proposed</span>
                                      <span className="text-amber-700/90 leading-snug block">
                                        {item.alternativeNote || "No reason provided by pharmacy."}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pharmacy Notes Quote */}
                        {bid.notes && bid.notes.trim() !== '' && bid.notes.toLowerCase() !== 'no' && (
                          <div className="flex gap-2.5 text-sm text-slate-700 bg-blue-50/50 p-4 rounded-xl border border-blue-100/60 shadow-sm">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-blue-900/80 mb-0.5">Pharmacy Note</p>
                              <p className="italic">"{bid.notes}"</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Financial Summary & Action CTA Column (Desktop) */}
                      <div className="bg-slate-50 md:bg-transparent md:border-l border-slate-100 p-6 md:w-64 shrink-0 flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                          {/* Logistics Summary */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Subtotal</span>
                              <span className="font-bold text-slate-900">{subtotal.toFixed(2)} EGP</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500 flex items-center gap-1.5"><Receipt className="w-4 h-4"/> Delivery Fee</span>
                              <span className="font-bold text-slate-900">
                                {bid.deliveryFee > 0 ? `${bid.deliveryFee.toFixed(2)} EGP` : <span className="text-green-600 uppercase">Free</span>}
                              </span>
                            </div>
                            {calculatedDiscount > 0 && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-emerald-600 font-medium">Discount</span>
                                <span className="text-emerald-600 font-bold">- {calculatedDiscount.toFixed(2)} EGP</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4"/> Arrives In</span>
                              <span className="font-bold text-slate-900">{bid.deliveryTimeInMinutes} Mins</span>
                            </div>
                          </div>
                          
                          <div className="h-px bg-slate-200 w-full" />
                          
                          {/* Total Price Block */}
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                            <div className="text-3xl font-black text-teal-600 tracking-tight">
                              {bid.totalPrice.toFixed(2)} <span className="text-base text-teal-600/60 font-medium">EGP</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        {bid.status === 'Rejected' ? (
                          <div className="flex items-center text-sm font-medium text-rose-600 bg-rose-50 px-3 py-2 rounded-md">
                            <XCircle className="w-4 h-4 mr-2" /> You rejected this offer
                          </div>
                        ) : bid.status === 'Accepted' ? (
                          <div className="flex items-center text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-md">
                            <CheckCircle className="w-5 h-5 mr-2" /> Offer Accepted - Preparing Order
                          </div>
                        ) : request.status === 'Closed' ? (
                          <div className="flex items-center justify-center text-sm font-bold text-slate-500 bg-slate-100 px-4 py-3 rounded-md">
                            Request Closed
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            <AlertDialog>
                              <AlertDialogTrigger 
                                render={
                                  <Button 
                                    className="w-full bg-teal-600 hover:bg-teal-700 shadow-sm h-12 text-base font-bold group-hover:scale-[1.02] transition-transform"
                                    disabled={isResponding}
                                    onClick={() => setActiveBidId(bid.id)}
                                  />
                                }
                              >
                                {isResponding && activeBidId === bid.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accept Offer'}
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Order Acceptance</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to accept this offer from {bid.pharmacyName} for {bid.totalPrice.toFixed(2)} EGP? This will close your request and cancel other pending offers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => respondToBid({ bidId: bid.id, status: 'Accepted', requestId })}
                                    className="bg-teal-600 hover:bg-teal-700"
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button
                              variant="outline"
                              className="w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200 h-10"
                              onClick={() => {
                                setActiveBidId(bid.id);
                                respondToBid({ bidId: bid.id, status: 'Rejected', requestId });
                              }}
                              disabled={isResponding}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CancelRequestDialog 
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelRequest}
        isPending={isCancelling}
      />
    </div>
  );
}
