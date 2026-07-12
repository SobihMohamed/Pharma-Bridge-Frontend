import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Receipt, Clock, Tag, CalendarDays, 
  AlertTriangle, CheckCircle2, XCircle, PackageX, Pencil, FileText,
  ClipboardList, Image as ImageIcon, MapPin, Activity, Clock4
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetBidDetailsQuery, BidItemDto } from '../api/bidding';
import { useGetPharmacyRequestDetailsQuery } from '../api/requests';
import { EditBidDialog } from '../components/EditBidDialog';

export default function BidDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bidId = Number(id);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: bid, isLoading, isError } = useGetBidDetailsQuery(bidId);
  const { data: requestData, isLoading: isReqLoading, isError: isReqError } = useGetPharmacyRequestDetailsQuery(bid?.prescriptionRequestId);

  const getStatusConfig = (status: string | undefined) => {
    switch (status) {
      case 'Accepted':
        return { 
          badge: <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Accepted</span>,
          color: 'text-green-600 dark:text-green-400'
        };
      case 'Rejected':
        return { 
          badge: <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5"/> Rejected</span>,
          color: 'text-red-600 dark:text-red-400'
        };
      case 'Cancelled':
        return { 
          badge: <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-400 border border-gray-200 dark:border-slate-700 flex items-center gap-1.5"><PackageX className="w-3.5 h-3.5"/> Cancelled</span>,
          color: 'text-gray-600 dark:text-slate-400'
        };
      case 'Pending':
      default:
        return { 
          badge: <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Pending</span>,
          color: 'text-yellow-600 dark:text-yellow-400'
        };
    }
  };

  const calculateUrgency = (expiresAt: string) => {
    if (!expiresAt) return { text: "No deadline", color: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700" };
    
    const expires = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    const diff = expires - now;

    if (diff <= 0) return { text: "Expired", color: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30" };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `In ${days} day(s)`, color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30" };
    }
    
    if (hours > 0) {
      return { text: `In ${hours}h ${minutes}m`, color: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30" };
    }
    
    return { text: `In ${minutes}m!`, color: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30" };
  };

  // Error State
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 p-8 rounded-2xl border border-red-100 dark:border-red-900/30 flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 mb-4 text-red-400" />
          <h2 className="text-xl font-bold mb-2">Bid Not Found</h2>
          <p className="text-red-500/80 dark:text-red-400/60 mb-6">We couldn't retrieve the details for this bid offer.</p>
          <Button onClick={() => navigate('/pharmacy/bids')} variant="outline" className="border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-950/20 text-red-700 dark:text-red-400">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Bids
          </Button>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading || !bid) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex gap-4 items-center">
          <div className="h-10 w-24 bg-gray-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-10 w-64 bg-gray-200 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-[600px] bg-gray-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
          <div className="lg:col-span-8 h-[600px] bg-gray-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const { badge, color } = getStatusConfig(bid.status);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/pharmacy/bids')} 
        className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Bids
      </Button>

      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
            Bid Offer #{bid.id}
            {badge}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4" />
            Submitted on {new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(bid.submittedAt))}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            disabled={bid.status !== 'Pending'}
            onClick={() => setIsEditDialogOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white shadow-sm"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Bid Offer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Patient's Original Request Context */}
        <div className="lg:col-span-4">
          <div className="bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-gray-400 dark:text-slate-500" />
              Original Request Context
            </h3>

            {isReqLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
              </div>
            ) : isReqError || !requestData ? (
              <div className="bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">Unable to load patient request details.</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Image */}
                {requestData.imageUrl ? (
                  <a 
                    href={requestData.imageUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block w-full aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group relative bg-white dark:bg-slate-950 shadow-sm"
                  >
                    <img 
                      src={requestData.imageUrl} 
                      alt="Prescription" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full font-medium text-sm shadow-sm">
                        <ImageIcon className="w-4 h-4" />
                        Click to view full image
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="w-full aspect-square rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-gray-400 dark:text-slate-600">
                    <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                    <span className="text-sm font-medium tracking-wide">No Image Provided</span>
                  </div>
                )}
                
                {/* Details */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Medication Query</p>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-900 dark:text-white font-bold text-xl leading-tight">{requestData.medicineName || 'N/A'}</p>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30 shrink-0">
                      {requestData.status}
                    </span>
                  </div>
                </div>

                {/* Market Context (Bids Competition) */}
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/30 p-3 flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg shrink-0">
                    <Activity className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-700/70 dark:text-amber-400/70 uppercase tracking-wider">Market Context</p>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Total Bids on this Request: {requestData.bidsCount}</p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Created At</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(requestData.createdAt))}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center ${calculateUrgency(requestData.expiresAt).color}`}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider mb-1 opacity-80">Deadline</span>
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Clock4 className="w-3 h-3" />
                      {calculateUrgency(requestData.expiresAt).text}
                    </span>
                  </div>
                </div>

                {/* Patient Notes */}
                {requestData.patientNotes ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Patient Notes</p>
                    <div className="bg-white dark:bg-slate-950 border-l-4 border-teal-500 dark:border-teal-400 p-4 shadow-sm text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic relative rounded-r-xl">
                      "{requestData.patientNotes}"
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Patient Notes</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">No additional notes from patient.</p>
                  </div>
                )}

                {/* Delivery Area */}
                {requestData.deliveryArea && (
                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="font-medium leading-relaxed">{requestData.deliveryArea}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bid Invoice Details */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                Pharmacy Invoice summary
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-slate-950/30 rounded-xl p-4 border border-gray-100 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">{bid.subtotal?.toFixed(2) || '0.00'} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-slate-400">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">+{bid.deliveryFee?.toFixed(2) || '0.00'} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span className="font-medium">-{bid.discountAmount?.toFixed(2) || '0.00'} EGP</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-950/30 rounded-xl p-4 border border-gray-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                  <span className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Grand Total</span>
                  <span className={`text-3xl font-bold ${color}`}>{bid.totalPrice?.toFixed(2) || '0.00'} <span className="text-base font-medium text-gray-500 dark:text-slate-400">EGP</span></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-slate-800">
                <div className="flex-1 bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Delivery Estimate</p>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    {bid.deliveryTimeInMinutes} minutes
                  </p>
                </div>
                {bid.notes && (
                  <div className="flex-1 bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Message to Patient</p>
                    <p className="text-gray-700 dark:text-slate-300 text-sm italic">"{bid.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                Invoice Items
              </h3>
              <span className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {bid.bidItems?.length || 0} Items
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {bid.bidItems?.map((item: BidItemDto, index: number) => (
                <div key={index} className="p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">{item.itemName}</span>
                        {item.isAlternative && (
                          <span className="bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/30">
                            ALTERNATIVE
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
                        <span><Tag className="w-3.5 h-3.5 inline mr-1 text-gray-400 dark:text-slate-500"/> {item.unitPrice.toFixed(2)} EGP</span>
                        <span>&times;</span>
                        <span className="font-medium text-gray-900 dark:text-white">Qty: {item.quantity}</span>
                      </div>

                      {item.isAlternative && item.alternativeNote && (
                        <div className="mt-3 flex items-start gap-2 text-sm bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-lg border border-amber-100/50 dark:border-amber-900/20 text-amber-900 dark:text-amber-300">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                          <p>{item.alternativeNote}</p>
                        </div>
                      )}
                    </div>

                    <div className="text-right sm:text-right shrink-0 bg-gray-50 dark:bg-slate-800/30 sm:bg-transparent sm:dark:bg-transparent p-3 sm:p-0 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Line Total</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.lineTotal?.toFixed(2) || (item.unitPrice * item.quantity).toFixed(2)} EGP
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

      </div>

      <EditBidDialog 
        bid={bid} 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
    </div>
  );
}
