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
      <DialogContent className="sm:max-w-4xl md:max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col p-0 overflow-hidden">
        
        {/* Fixed Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#f0f9ff] dark:bg-sky-950/40 border border-[#bae6fd50] dark:border-sky-900/30"
            >
              <Calculator className="w-5 h-5 text-[#0284c7] dark:text-sky-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
                Edit Bid Offer #{bid.id}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium mt-0.5 text-slate-500 dark:text-slate-400">
                Modify prices, delivery fees, or alternative notes. Total adjusts automatically.
              </DialogDescription>
            </div>
          </div>
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
