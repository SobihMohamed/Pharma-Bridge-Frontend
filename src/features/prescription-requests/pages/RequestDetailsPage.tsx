import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

import RequestSummaryBox from '../components/RequestSummaryBox';
import CancelRequestDialog from '../components/CancelRequestDialog';
import BidsList from '@/features/bids/components/BidsList';
import { useRequestDetailsQuery } from '../hooks/usePrescriptionRequestQueries';
import { useCancelRequestMutation } from '../hooks/usePrescriptionRequestMutations';

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  // Parse ID securely. If undefined, pass 0 (enabled query guard will block it or it fails safely)
  const requestId = id ? parseInt(id, 10) : 0;

  const { data: request, isLoading, isError } = useRequestDetailsQuery(requestId);
  const { mutate: cancelRequest, isPending: isCancelling } = useCancelRequestMutation();

  const handleAcceptClick = (bidId: string) => {
    setSelectedBidId(bidId);
    setIsConfirmOpen(true);
  };

  const handleRejectClick = (bidId: string) => {
    // Optimistic UI or API call placeholder for rejecting a bid
    toast.info('Offer rejected and removed (placeholder).');
  };

  const confirmAcceptOffer = async () => {
    if (!selectedBidId) return;
    
    setIsAccepting(true);
    // Simulate API call for accepting
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Offer accepted successfully! Order created.');
    setIsAccepting(false);
    setIsConfirmOpen(false);
    
    // Redirect to orders (placeholder route for now)
    navigate('/orders/new_order_id');
  };

  const handleCancelRequest = () => {
    cancelRequest(requestId, {
      onSuccess: () => {
        setIsCancelDialogOpen(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-4 mb-6 animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="w-48 h-6 bg-gray-200 rounded"></div>
            <div className="w-64 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-96 animate-pulse">
              <div className="w-1/3 h-6 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-64 animate-pulse"></div>
          </div>
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
        <h2 className="text-2xl font-bold text-gray-900">Request not found</h2>
        <p className="text-gray-500 max-w-md">
          The request you are looking for does not exist or you don't have access to it.
        </p>
        <button 
          onClick={() => navigate('/requests')} 
          className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          Back to Requests
        </button>
      </div>
    );
  }

  const canCancel = request.status === 'Pending' || request.status === 'HasBids';

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request #{request.id.toString().slice(0, 8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500">Review request details and pharmacy offers below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Request Details */}
        <div className="lg:col-span-5 space-y-6">
          <RequestSummaryBox request={request} />

          {/* Cancel Request Button */}
          {canCancel && (
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-gray-900">Danger Zone</h3>
              <p className="text-xs text-gray-500">
                You can cancel this request. If you cancel, all pharmacy offers will be declined.
              </p>
              <button
                onClick={() => setIsCancelDialogOpen(true)}
                disabled={isCancelling}
                className="w-full mt-2 flex justify-center py-2.5 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel Request
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Bids List */}
        <div className="lg:col-span-7">
          {request.bids && request.bids.length > 0 ? (
            <BidsList 
              bids={request.bids} 
              onAccept={handleAcceptClick}
              onReject={handleRejectClick}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-8 text-center">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Waiting for Offers</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                We've notified nearby pharmacies. You'll receive offers here as soon as they review your request.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Accept this offer?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to accept this offer? This will automatically reject other offers and proceed to create your order.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  disabled={isAccepting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAcceptOffer}
                  disabled={isAccepting}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex justify-center items-center transition-colors disabled:opacity-70"
                >
                  {isAccepting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Yes, Accept Offer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Request Dialog */}
      <CancelRequestDialog 
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelRequest}
        isPending={isCancelling}
      />
    </div>
  );
}
