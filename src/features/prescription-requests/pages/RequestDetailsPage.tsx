import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

import RequestSummaryBox from '../components/RequestSummaryBox';
import { PrescriptionRequestDto } from '../types';
import { MOCK_REQUESTS } from '../data/mockRequests';

import BidsList from '@/features/bids/components/BidsList';

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<PrescriptionRequestDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchRequest = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // fake delay
      
      const found = MOCK_REQUESTS.find(r => r.id === id);
      if (found) {
        setRequest(found);
      } else {
        setRequest(null);
      }
      
      setIsLoading(false);
    };
    fetchRequest();
  }, [id]);

  const handleAcceptClick = (bidId: string) => {
    setSelectedBidId(bidId);
    setIsConfirmOpen(true);
  };

  const handleRejectClick = (bidId: string) => {
    setRequest(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        bids: prev.bids.filter(b => b.id !== bidId)
      };
    });
    toast.info('Offer rejected and removed.');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Request not found</h2>
        <button onClick={() => navigate('/requests')} className="text-teal-600 hover:underline mt-4">
          Go back to requests
        </button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Request #{request.id.slice(-6).toUpperCase()}</h1>
          <p className="text-sm text-gray-500">Review request details and pharmacy offers below.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Request Details */}
        <div className="lg:col-span-5 space-y-6">
          <RequestSummaryBox request={request} />
        </div>

        {/* Right Column - Bids List */}
        <div className="lg:col-span-7">
          <BidsList 
            bids={request.bids} 
            onAccept={handleAcceptClick}
            onReject={handleRejectClick}
          />
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
    </div>
  );
}
