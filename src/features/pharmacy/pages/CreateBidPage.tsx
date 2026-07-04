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
        <div className="bg-amber-50 text-amber-700 p-8 rounded-xl flex flex-col items-center justify-center text-center border border-amber-200">
          <AlertCircle className="w-10 h-10 mb-3" />
          <h2 className="text-xl font-bold mb-1">Request Data Lost</h2>
          <p className="text-amber-700/80 mb-4 max-w-md">
            The details for this request were lost, likely due to a page refresh. Please return to the Radar and select the request again to submit your bid.
          </p>
          <Button onClick={() => navigate('/pharmacy/live-requests')} variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
            Return to Radar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Receipt className="w-7 h-7 text-teal-600" />
          Submit Bid <span className="text-gray-400 font-normal">| Req #{request.id}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review the patient's prescription and construct your competitive offer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Request Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm sticky top-24">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Prescription Details</h3>
            </div>
            
            {request.imageUrl ? (
              <div className="w-full h-48 bg-gray-100 relative group cursor-pointer" onClick={() => window.open(request.imageUrl!, '_blank')}>
                <img src={request.imageUrl} alt="Prescription" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Click to expand</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-50 flex flex-col items-center justify-center text-gray-400 border-b border-gray-100">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs">No Image Attached</span>
              </div>
            )}

            <div className="p-5 space-y-4">
              {request.medicineName && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Medication</p>
                  <p className="text-gray-900 font-medium">{request.medicineName}</p>
                </div>
              )}
              
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivery Area</p>
                <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  {request.deliveryArea || 'Nearby'}
                </div>
              </div>

              {request.patientNotes && (
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">Patient Notes</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{request.patientNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Bid Form */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
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
