import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Receipt, MapPin, ArrowLeft, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateBidMutation, CreateBidDto } from '../api/bidding';
import { useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import { toast } from 'sonner';
import { SharedBidForm } from '../components/SharedBidForm';

export default function CreateBidPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const requestId = Number(id);

  // Extract Request Data passed via Router State
  const request = location.state?.requestData;

  // Fetch Pharmacy Profile
  const { data: profile } = useMyPharmacyProfileQuery();
  
  // Safely extract the ID regardless of whether it's wrapped in an ApiResponse data object
  const rawId = (profile as any)?.data?.id || (profile as any)?.id;
  const pharmacyId = rawId ? Number(rawId) : 0;

  // Mutation
  const mutation = useCreateBidMutation(pharmacyId);

  const handleSubmit = (data: any, calculatedSubtotal: number, calculatedTotal: number) => {
    if (!pharmacyId) {
      toast.error("Error: Pharmacy Profile ID is missing. Cannot submit.");
      return;
    }
    
    // Build exact payload matching the required JSON schema
    const payload: CreateBidDto = {
      prescriptionRequestId: requestId,
      pharmacyId: pharmacyId,
      subtotal: calculatedSubtotal,
      discountAmount: Number(data.discountAmount) || 0,
      deliveryFee: Number(data.deliveryFee) || 0,
      notes: data.notes || "",
      deliveryTimeInMinutes: Number(data.deliveryTimeInMinutes) || 0,
      bidItems: data.bidItems.map((item: any) => ({
        itemName: item.itemName,
        unitPrice: Number(item.unitPrice) || 0,
        quantity: Number(item.quantity) || 0,
        isAlternative: item.isAlternative || false,
        alternativeNote: item.alternativeNote || ""
      }))
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success('🎉 Fantastic! Your competitive bid has been sent to the patient!');
        navigate('/pharmacy/bids');
      }
    });
  };

  // Fallback UI if state is missing (e.g., hard refresh)
  if (!request) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-amber-50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 p-8 rounded-xl flex flex-col items-center justify-center text-center border border-amber-200 dark:border-amber-900/30">
          <AlertCircle className="w-10 h-10 mb-3" />
          <h2 className="text-xl font-bold mb-1">Request Data Lost</h2>
          <p className="text-amber-700/80 dark:text-amber-400/60 mb-4 max-w-md">
            The details for this request were lost, likely due to a page refresh. Please return to the Radar and select the request again to submit your bid.
          </p>
          <Button onClick={() => navigate('/pharmacy/live-requests')} variant="outline" className="border-amber-300 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/20">
            Return to Radar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ paddingTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-gray-950 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow"
            style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)' }}
          >
            <Receipt className="w-6 h-6" style={{ color: '#fff' }} />
          </div> */}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Submit Bid</h1>
            <p className="text-sm text-gray-400 dark:text-slate-400">Req #{request.id} • Construct your competitive offer</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Request Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-[#f1f5f9] dark:border-slate-800 overflow-hidden shadow-sm sticky top-24">
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Prescription Details</h3>
            </div>
            
            {request.imageUrl ? (
              <div className="w-full h-48 bg-gray-100 dark:bg-slate-900 relative group cursor-pointer" onClick={() => window.open(request.imageUrl!, '_blank')}>
                <img src={request.imageUrl} alt="Prescription" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">Click to expand</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-50 dark:bg-slate-900/20 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 border-b border-gray-100 dark:border-slate-800">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-bold">No Image Attached</span>
              </div>
            )}

            <div className="p-5 space-y-4">
              {request.medicineName && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Medication</p>
                  <p className="text-gray-900 dark:text-white font-bold text-sm">{request.medicineName}</p>
                </div>
              )}
              
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">Delivery Area</p>
                <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold text-sm">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {request.deliveryArea || 'Nearby'}
                </div>
              </div>

              {request.patientNotes && (
                <div className="bg-sky-50/50 dark:bg-sky-950/10 p-3.5 rounded-xl border border-sky-100 dark:border-sky-900/30">
                  <p className="text-[10px] font-bold text-sky-850 dark:text-sky-400 uppercase tracking-wider mb-1">Patient Notes</p>
                  <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed font-medium">{request.patientNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Bid Form */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-[#f1f5f9] dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <SharedBidForm 
              mode="create" 
              onSubmit={handleSubmit} 
              isSubmitting={mutation.isPending} 
              onCancel={() => navigate(-1)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
