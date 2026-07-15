import React, { useEffect } from 'react';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Clock, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const bidItemSchema = z.object({
  id: z.number().optional().default(0),
  itemName: z.string().trim().min(1, 'Item name is required').refine(val => !/^\d+$/.test(val), 'Item name cannot be only numbers'),
  unitPrice: z.coerce.number().min(0, 'Price cannot be negative').default(0),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1').default(1),
  isAlternative: z.boolean().default(false),
  alternativeNote: z.string().optional().nullable()
}).refine((data: any) => !data.isAlternative || (data.alternativeNote && data.alternativeNote.length > 0), {
  message: "Alternative note is required if this is an alternative medicine",
  path: ["alternativeNote"]
});

const bidFormSchema = z.object({
  deliveryTimeInMinutes: z.coerce.number().min(1, 'Delivery time is required').default(30),
  deliveryFee: z.coerce.number().min(0, 'Fee cannot be negative').default(0),
  discountAmount: z.coerce.number().min(0, 'Discount cannot be negative').default(0),
  notes: z.string().optional().nullable(),
  bidItems: z.array(bidItemSchema).min(1, 'At least one item is required')
});

type BidFormValues = z.infer<typeof bidFormSchema>;

export interface SharedBidFormProps {
  initialValues?: any;
  onSubmit: (data: any, calculatedSubtotal: number, calculatedTotal: number) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onCancel?: () => void;
}

export function SharedBidForm({ initialValues, onSubmit, isSubmitting, mode, onCancel }: SharedBidFormProps) {
  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidFormSchema) as any,
    defaultValues: {
      deliveryTimeInMinutes: initialValues?.deliveryTimeInMinutes || 30,
      deliveryFee: initialValues?.deliveryFee || 0,
      discountAmount: initialValues?.discountAmount || 0,
      notes: initialValues?.notes || '',
      bidItems: initialValues?.bidItems && initialValues.bidItems.length > 0 
        ? initialValues.bidItems.map((item: any) => ({
            id: item.id || 0,
            itemName: item.itemName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            isAlternative: item.isAlternative || false,
            alternativeNote: item.alternativeNote || ''
          }))
        : [{ id: 0, itemName: '', unitPrice: 0, quantity: 1, isAlternative: false, alternativeNote: '' }]
    },
    mode: 'onChange'
  });

  const { control, handleSubmit, formState: { errors }, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bidItems",
    keyName: "fieldId"
  });

  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues) {
      reset({
        deliveryTimeInMinutes: initialValues.deliveryTimeInMinutes || 30,
        deliveryFee: initialValues.deliveryFee || 0,
        discountAmount: initialValues.discountAmount || 0,
        notes: initialValues.notes || '',
        bidItems: initialValues.bidItems?.length > 0 
          ? initialValues.bidItems.map((item: any) => ({
              id: item.id || 0,
              itemName: item.itemName,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              isAlternative: item.isAlternative || false,
              alternativeNote: item.alternativeNote || ''
            }))
          : [{ id: 0, itemName: '', unitPrice: 0, quantity: 1, isAlternative: false, alternativeNote: '' }]
      });
    }
  }, [initialValues, reset]);

  // Watch fields for real-time calculations
  const watchedBidItems = useWatch({ control, name: 'bidItems' }) || [];
  const watchedDeliveryFee = useWatch({ control, name: 'deliveryFee' }) || 0;
  const watchedDiscountAmount = useWatch({ control, name: 'discountAmount' }) || 0;

  // Real-time calculation logic
  const calculatedSubtotal = watchedBidItems.reduce((acc: number, item: any) => {
    if (!item) return acc;
    const price = Number(item.unitPrice) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + (price * qty);
  }, 0);

  const calculatedTotal = Math.max(0, calculatedSubtotal + (Number(watchedDeliveryFee) || 0) - (Number(watchedDiscountAmount) || 0));

  const handleFormSubmit = (data: BidFormValues) => {
    onSubmit(data, calculatedSubtotal, calculatedTotal);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 flex flex-col min-h-0">
      
      {/* Bid Items Section */}
      <div className="space-y-5 flex-1">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Included Items</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => append({ id: 0, itemName: '', unitPrice: 0, quantity: 1, isAlternative: false, alternativeNote: '' })}
            className="text-teal-600 border-teal-200 hover:bg-teal-50 dark:text-teal-400 dark:border-teal-900/50 dark:hover:bg-teal-950/20 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>
        {errors.bidItems?.root && (
          <p className="text-xs text-red-500">{errors.bidItems.root.message}</p>
        )}

        <div className="space-y-4">
          {fields.map((field: any, index: number) => (
            <div 
              key={field.fieldId} 
              className="p-5 bg-white dark:bg-slate-900/30 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 relative transition-all hover:border-teal-250 dark:hover:border-teal-900/50 shadow-sm"
            >
              <input type="hidden" {...form.register(`bidItems.${index}.id` as const)} />
              
              {fields.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pr-6 items-start">
                <div className="md:col-span-6 space-y-1.5">
                  <Label className="text-gray-700 dark:text-slate-200">Item Name</Label>
                  <Controller
                    control={control}
                    name={`bidItems.${index}.itemName`}
                    render={({ field: controllerField }) => (
                      <Input 
                        {...controllerField}
                        value={controllerField.value || ''}
                        placeholder="e.g. Panadol Extra 500mg" 
                        className={`bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 border-gray-200 dark:border-slate-800 rounded-xl text-xs h-9 ${errors.bidItems?.[index]?.itemName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.bidItems?.[index]?.itemName && (
                    <p className="text-xs text-red-500">{errors.bidItems[index]?.itemName?.message}</p>
                  )}
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <Label className="text-gray-700 dark:text-slate-200">Price (EGP)</Label>
                  <Controller
                    control={control}
                    name={`bidItems.${index}.unitPrice`}
                    render={({ field: controllerField }) => (
                      <Input 
                        {...controllerField}
                        type="number" 
                        step="0.01"
                        value={controllerField.value === 0 ? '' : controllerField.value}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0);
                          controllerField.onChange(val);
                        }}
                        className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 border-gray-200 dark:border-slate-800 rounded-xl text-xs h-9"
                      />
                    )}
                  />
                  {errors.bidItems?.[index]?.unitPrice && (
                    <p className="text-xs text-red-500">{errors.bidItems[index]?.unitPrice?.message}</p>
                  )}
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <Label className="text-gray-700 dark:text-slate-200">Qty</Label>
                  <Controller
                    control={control}
                    name={`bidItems.${index}.quantity`}
                    render={({ field: controllerField }) => (
                      <Input 
                        {...controllerField}
                        type="number" 
                        value={controllerField.value === 0 ? '' : controllerField.value}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0);
                          controllerField.onChange(val);
                        }}
                        className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 border-gray-200 dark:border-slate-800 rounded-xl text-xs h-9"
                      />
                    )}
                  />
                  {errors.bidItems?.[index]?.quantity && (
                    <p className="text-xs text-red-500">{errors.bidItems[index]?.quantity?.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2.5 border-t border-gray-100 dark:border-slate-800/80">
                <Controller
                  control={control}
                  name={`bidItems.${index}.isAlternative`}
                  render={({ field: controllerField }) => (
                    <Checkbox 
                      id={`alt-${field.fieldId}`} 
                      checked={controllerField.value || false}
                      onCheckedChange={(checked) => controllerField.onChange(checked === true)}
                    />
                  )}
                />
                <Label htmlFor={`alt-${field.fieldId}`} className="font-normal text-xs text-gray-500 dark:text-slate-400 cursor-pointer select-none">
                  This is an alternative medicine
                </Label>
              </div>

              {watchedBidItems?.[index]?.isAlternative && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-amber-600 dark:text-amber-500 font-bold text-xs">Why is this alternative recommended?</Label>
                  <Controller
                    control={control}
                    name={`bidItems.${index}.alternativeNote`}
                    render={({ field: controllerField }) => (
                      <Input 
                        {...controllerField}
                        value={controllerField.value || ''}
                        placeholder="e.g. Same active ingredient, more affordable..." 
                        className={`bg-amber-50/20 dark:bg-amber-950/10 text-slate-900 dark:text-slate-100 border-amber-200 dark:border-amber-900/30 rounded-xl text-xs h-9 ${errors.bidItems?.[index]?.alternativeNote ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.bidItems?.[index]?.alternativeNote && (
                    <p className="text-xs text-red-500">{errors.bidItems[index]?.alternativeNote?.message}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Pricing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-150 dark:border-slate-800 pt-8 shrink-0">
        <div className="space-y-5">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-slate-500" />
            Delivery Logistics
          </h3>
          <div className="space-y-1.5">
            <Label className="text-gray-700 dark:text-slate-200 text-xs">Estimated Delivery Time (Minutes)</Label>
            <Controller
              control={control}
              name="deliveryTimeInMinutes"
              render={({ field: controllerField }) => (
                <Input 
                  {...controllerField}
                  type="number" 
                  value={controllerField.value === 0 ? '' : controllerField.value}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0);
                    controllerField.onChange(val);
                  }}
                  className="max-w-[200px] bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 border-gray-200 dark:border-slate-800 rounded-xl text-xs h-9"
                />
              )}
            />
            {errors.deliveryTimeInMinutes && (
              <p className="text-xs text-red-500">{errors.deliveryTimeInMinutes.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-gray-700 dark:text-slate-200 text-xs">Additional Message to Patient</Label>
            <Controller
              control={control}
              name="notes"
              render={({ field: controllerField }) => (
                <Textarea 
                  {...controllerField}
                  value={controllerField.value || ''}
                  className="w-full min-h-[100px] border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-slate-900 dark:text-slate-100"
                  placeholder="e.g. Needs refrigeration upon arrival..." 
                />
              )}
            />
          </div>
        </div>

        <div className="bg-[#f8fafc] dark:bg-slate-900/30 p-6 rounded-2xl border border-gray-100 dark:border-slate-800/80 space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-sky-500" />
            Pricing Summary
          </h3>
          
          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-slate-400 pb-3 border-b border-gray-200 dark:border-slate-850 border-dashed">
            <span>Items Subtotal</span>
            <span className="font-bold text-gray-900 dark:text-white">{calculatedSubtotal.toFixed(2)} EGP</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <Label className="text-gray-600 dark:text-slate-400">Delivery Fee (+)</Label>
            </div>
            <Controller
              control={control}
              name="deliveryFee"
              render={({ field: controllerField }) => (
                <Input 
                  {...controllerField}
                  type="number" 
                  step="0.01"
                  value={controllerField.value === 0 ? '' : controllerField.value}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0);
                    controllerField.onChange(val);
                  }}
                  className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 border-gray-250 dark:border-slate-800 rounded-xl text-xs h-9 text-right font-medium"
                />
              )}
            />
          </div>

          <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-slate-850 border-dashed">
            <div className="flex justify-between items-center text-xs">
              <Label className="text-gray-600 dark:text-slate-400">Discount Amount (-)</Label>
            </div>
            <Controller
              control={control}
              name="discountAmount"
              render={({ field: controllerField }) => (
                <Input 
                  {...controllerField}
                  type="number" 
                  step="0.01"
                  value={controllerField.value === 0 ? '' : controllerField.value}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0);
                    controllerField.onChange(val);
                  }}
                  className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 border-gray-250 dark:border-slate-800 rounded-xl text-xs h-9 text-right text-green-600 dark:text-emerald-500 font-medium"
                />
              )}
            />
          </div>
          
          <div className="pt-2 flex justify-between items-center">
            <div>
              <span className="block font-bold text-xs text-gray-900 dark:text-white">Total Bid Value</span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">What the patient will pay</span>
            </div>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
              {calculatedTotal.toFixed(2)} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">EGP</span>
            </span>
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-150 dark:border-slate-800 shrink-0">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto px-6 rounded-xl text-xs h-10 font-bold dark:border-slate-800 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>
        )}

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-teal-650 hover:bg-teal-700 text-white px-8 shadow-sm transition-all rounded-xl text-xs h-10 font-bold"
          style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)', color: '#fff', border: 'none' }}
        >
          {isSubmitting ? (mode === 'create' ? 'Submitting...' : 'Saving...') : (mode === 'create' ? 'Submit Bid Offer' : 'Save Changes')}
        </Button>
      </div>
    </form>
  );
}
