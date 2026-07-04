import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Clock, Calculator, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const bidItemSchema = z.object({
  id: z.number().optional().default(0),
  itemName: z.string().min(1, 'Item name is required'),
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
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculatedSubtotal, setCalculatedSubtotal] = useState(0);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

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

  const { control, handleSubmit, formState: { errors }, reset, getValues, trigger } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bidItems",
    keyName: "fieldId"
  });

  // Reset form when initialValues change (useful for edit modal hydration)
  useEffect(() => {
    if (initialValues) {
      form.reset({
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
      // In edit mode, if we have initial values, we want them to recalculate instantly, 
      // but to force them to use the "calculate" button, we can just let it be false.
      // Wait, in edit mode, they should still calculate. Let's reset calculated state.
      setIsCalculated(false);
    }
  }, [initialValues, form]);

  const watchedFields = useWatch({ control });
  
  useEffect(() => {
    setIsCalculated(false);
  }, [JSON.stringify(watchedFields)]);

  const handleCalculate = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    const data = getValues();
    
    const subtotal = data.bidItems.reduce((acc: number, item: any) => {
      const price = Number(item.unitPrice) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + (price * qty);
    }, 0);

    const deliveryFee = Number(data.deliveryFee) || 0;
    const discount = Number(data.discountAmount) || 0;
    const total = Math.max(0, subtotal + deliveryFee - discount);

    setCalculatedSubtotal(subtotal);
    setCalculatedTotal(total);
    setIsCalculated(true);
  };

  const handleFormSubmit = (data: BidFormValues) => {
    if (!isCalculated) return;
    onSubmit(data, calculatedSubtotal, calculatedTotal);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 flex flex-col min-h-0">
      
      {/* Bid Items Section */}
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Included Items</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => append({ id: 0, itemName: '', unitPrice: 0, quantity: 1, isAlternative: false, alternativeNote: '' })}
            className="text-teal-600 border-teal-200 hover:bg-teal-50"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>
        {errors.bidItems?.root && (
          <p className="text-sm text-red-500">{errors.bidItems.root.message}</p>
        )}

        <div className="space-y-4">
          {fields.map((field: any, index: number) => (
            <div key={field.fieldId} className="p-5 bg-white rounded-xl border border-gray-200 space-y-4 relative transition-all hover:border-teal-200 shadow-sm">
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
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pr-8 items-start">
                <div className="md:col-span-6 space-y-1.5">
                  <Label>Item Name</Label>
                  <Controller
                    control={control}
                    name={`bidItems.${index}.itemName`}
                    render={({ field: controllerField }) => (
                      <Input 
                        {...controllerField}
                        value={controllerField.value || ''}
                        placeholder="e.g. Panadol Extra 500mg" 
                        className={`bg-white ${errors.bidItems?.[index]?.itemName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    )}
                  />
                  {errors.bidItems?.[index]?.itemName && (
                    <p className="text-xs text-red-500">{errors.bidItems[index]?.itemName?.message}</p>
                  )}
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <Label>Price (EGP)</Label>
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
                        className="bg-white"
                      />
                    )}
                  />
                  {errors.bidItems?.[index]?.unitPrice && (
                    <p className="text-xs text-red-500">{errors.bidItems[index]?.unitPrice?.message}</p>
                  )}
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <Label>Qty</Label>
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
                        className="bg-white"
                      />
                    )}
                  />
                  {errors.bidItems?.[index]?.quantity && (
                    <p className="text-xs text-red-500">{errors.bidItems[index]?.quantity?.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                <Controller
                  control={control}
                  name={`bidItems.${index}.isAlternative`}
                  render={({ field: controllerField }) => (
                    <Checkbox 
                      id={`alt-${field.id}`} 
                      checked={controllerField.value || false}
                      onCheckedChange={(checked) => controllerField.onChange(checked === true)}
                    />
                  )}
                />
                <Label htmlFor={`alt-${field.id}`} className="font-normal text-sm text-gray-600 cursor-pointer select-none">
                  This is an alternative medicine
                </Label>
              </div>

              {watchedFields.bidItems?.[index]?.isAlternative && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-amber-700">Why is this alternative recommended?</Label>
                  <Controller
                    control={control}
                    name={`bidItems.${index}.alternativeNote`}
                    render={({ field: controllerField }) => (
                      <Input 
                        {...controllerField}
                        value={controllerField.value || ''}
                        placeholder="e.g. Same active ingredient, more affordable..." 
                        className={`bg-amber-50/30 border-amber-200 ${errors.bidItems?.[index]?.alternativeNote ? "border-red-500" : ""}`}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8 shrink-0">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Delivery Logistics
          </h3>
          <div className="space-y-2">
            <Label>Estimated Delivery Time (Minutes)</Label>
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
                  className="max-w-[200px]"
                />
              )}
            />
            {errors.deliveryTimeInMinutes && (
              <p className="text-xs text-red-500">{errors.deliveryTimeInMinutes.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Additional Message to Patient</Label>
            <Controller
              control={control}
              name="notes"
              render={({ field: controllerField }) => (
                <Textarea 
                  {...controllerField}
                  value={controllerField.value || ''}
                  className="w-full min-h-[100px] border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="e.g. Needs refrigeration upon arrival..." 
                />
              )}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
          
          <div className="flex justify-between items-center text-sm text-gray-600 pb-3 border-b border-gray-200 border-dashed">
            <span>Items Subtotal</span>
            <span className="font-medium text-gray-900">{isCalculated ? calculatedSubtotal.toFixed(2) : '--'} EGP</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <Label className="text-gray-600">Delivery Fee (+)</Label>
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
                  className="bg-white text-right font-medium"
                />
              )}
            />
          </div>

          <div className="space-y-2 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <Label className="text-gray-600">Discount Amount (-)</Label>
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
                  className="bg-white text-right text-green-600 font-medium"
                />
              )}
            />
          </div>
          
          <div className="pt-2 flex justify-between items-center">
            <div>
              <span className="block font-semibold text-gray-900">Total Bid Value</span>
              <span className="text-xs text-gray-500">What the patient will pay</span>
            </div>
            <span className="text-2xl font-bold text-teal-600">{isCalculated ? calculatedTotal.toFixed(2) : '--'} <span className="text-sm font-medium">EGP</span></span>
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100 shrink-0">
        {!isCalculated && (
          <p className="text-sm text-amber-600 mr-auto flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Please calculate total to enable submission.
          </p>
        )}
        
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto px-6"
          >
            Cancel
          </Button>
        )}

        <Button 
          type="button" 
          onClick={handleCalculate}
          className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-6 shadow-sm"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Total
        </Button>

        <Button 
          type="submit" 
          disabled={isSubmitting || !isCalculated}
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 shadow-sm transition-all"
        >
          {isSubmitting ? (mode === 'create' ? 'Submitting...' : 'Saving...') : (mode === 'create' ? 'Submit Bid Offer' : 'Save Changes')}
        </Button>
      </div>
    </form>
  );
}
