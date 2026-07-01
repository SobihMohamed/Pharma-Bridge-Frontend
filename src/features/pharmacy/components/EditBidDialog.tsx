import React from 'react';
import { Calculator } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { BidDto, useUpdateBidMutation } from '../api/bidding';
import { useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import { SharedBidForm } from './SharedBidForm';

interface EditBidDialogProps {
  bid: BidDto;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBidDialog({ bid, isOpen, onOpenChange }: EditBidDialogProps) {
  const { data: profile } = useMyPharmacyProfileQuery();
  const pharmacyId = Number(profile?.id) || 1;

  const updateMutation = useUpdateBidMutation(pharmacyId);

  const handleSubmit = (data: any, calculatedSubtotal: number, calculatedTotal: number) => {
    const payload = {
      id: bid.id,
      subtotal: calculatedSubtotal,
      discountAmount: data.discountAmount,
      deliveryFee: data.deliveryFee,
      deliveryTimeInMinutes: data.deliveryTimeInMinutes,
      notes: data.notes,
      bidItems: data.bidItems.map((item: any) => ({
        id: item.id || 0,
        itemName: item.itemName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        isAlternative: item.isAlternative,
        alternativeNote: item.alternativeNote,
      }))
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl md:max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-50 flex flex-col p-0 overflow-hidden">
        
        {/* Fixed Header */}
        <div className="p-6 pb-4 border-b border-gray-100 bg-white shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-teal-600" />
            Edit Bid Offer #{bid.id}
          </DialogTitle>
          <DialogDescription>
            Modify prices, delivery fees, or alternative notes dynamically. Total adjusts automatically.
          </DialogDescription>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <SharedBidForm 
            mode="edit"
            initialValues={bid}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
