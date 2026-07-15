import React, { useState, useRef, useEffect } from 'react';
import { X, CloudUpload, AlertTriangle, Send, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { usePatientAddressesQuery } from '../../profile/hooks/useAddressQueries';

interface NewRequestFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

export default function NewRequestForm({ onSubmit, isLoading }: NewRequestFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [medicineName, setMedicineName] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryAddressId, setDeliveryAddressId] = useState<number | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: addresses, isLoading: isAddressesLoading } = usePatientAddressesQuery();

  useEffect(() => {
    if (addresses && addresses.length > 0 && deliveryAddressId === '') {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setDeliveryAddressId(defaultAddress.id);
      } else {
        setDeliveryAddressId(addresses[0].id); // Fallback to first if no default
      }
    }
  }, [addresses, deliveryAddressId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, GIF)');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    let newErrors: Record<string, string> = {};

    if (!medicineName.trim() && !imageFile) {
      toast.error('Please provide at least a medicine name or upload an image.');
      return;
    }

    if (medicineName && !medicineName.trim()) {
      newErrors.medicineName = "Medicine name cannot be only spaces";
    } else if (medicineName && /^\d+$/.test(medicineName.trim())) {
      newErrors.medicineName = "Medicine name cannot be only numbers";
    }

    if (notes && !notes.trim()) {
      newErrors.notes = "Notes cannot be only spaces";
    }

    if (!deliveryAddressId) {
      newErrors.address = "Please select a delivery address.";
      toast.error('Please select a delivery address.');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    if (imageFile) formData.append('ImageUrl', imageFile);
    if (medicineName.trim()) formData.append('MedicineName', medicineName.trim());
    if (notes.trim()) formData.append('PatientNotes', notes.trim());
    formData.append('DeliveryAddressId', deliveryAddressId.toString());

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Row: Medicine Name & Upload Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Medicine Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
            Medicine Name <span className="text-gray-500 dark:text-slate-400 font-normal">(Optional if image provided)</span>
          </label>
          <input
            type="text"
            value={medicineName}
            onChange={(e) => { setMedicineName(e.target.value); setErrors(prev => ({...prev, medicineName: ''})); }}
            className={`w-full h-14 px-4 bg-[#f7f9fb] dark:bg-[#131b2e] border ${errors.medicineName ? 'border-red-500 ring-2 ring-red-500/50' : 'border-[#bec8d1] dark:border-slate-700 focus:ring-[#006590] dark:focus:ring-sky-500 focus:border-[#006590] dark:focus:border-sky-500'} rounded-2xl focus:ring-2 transition-all text-base outline-none text-gray-900 dark:text-white dark:placeholder-slate-500`}
            placeholder="e.g. Panadol Extra"
          />
          {errors.medicineName && <p className="text-red-500 text-xs mt-1">{errors.medicineName}</p>}
        </div>

        {/* Upload Zone */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
            Prescription Image <span className="text-gray-500 dark:text-slate-400 font-normal">(Optional if name provided)</span>
          </label>
          
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#006590]', 'bg-[#006590]/5', 'dark:border-sky-500', 'dark:bg-sky-900/20'); }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[#006590]', 'bg-[#006590]/5', 'dark:border-sky-500', 'dark:bg-sky-900/20'); }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-[#006590]', 'bg-[#006590]/5', 'dark:border-sky-500', 'dark:bg-sky-900/20');
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              className="group relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-[#bec8d1] dark:border-slate-700 rounded-2xl bg-[#f2f4f6] dark:bg-slate-800/50 hover:bg-[#eceef0] dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <CloudUpload className="text-[#006590] dark:text-sky-400 w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                <span className="text-[#006590] dark:text-sky-400 font-bold">Upload a file</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center h-48 border-2 border-solid border-[#006590] dark:border-sky-500 rounded-2xl bg-[#f7f9fb] dark:bg-[#131b2e] p-2">
              <img 
                src={imagePreview} 
                alt="Prescription preview" 
                className="max-h-full object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-1.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
          Additional Notes <span className="text-gray-500 dark:text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setErrors(prev => ({...prev, notes: ''})); }}
          className={`w-full p-4 bg-[#f7f9fb] dark:bg-[#131b2e] border ${errors.notes ? 'border-red-500 ring-2 ring-red-500/50' : 'border-[#bec8d1] dark:border-slate-700 focus:ring-[#006590] dark:focus:ring-sky-500 focus:border-[#006590] dark:focus:border-sky-500'} rounded-2xl focus:ring-2 transition-all text-base outline-none resize-none text-gray-900 dark:text-white dark:placeholder-slate-500`}
          placeholder="Any specific instructions for the pharmacy..."
        />
        {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
      </div>

      {/* Delivery Address Dropdown */}
      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
          Delivery Address <span className="text-[#ba1a1a] dark:text-red-400">*</span>
        </label>
        
        <div className="relative group">
          <select
            id="address"
            value={deliveryAddressId}
            onChange={(e) => { setDeliveryAddressId(Number(e.target.value)); setErrors(prev => ({...prev, address: ''})); }}
            disabled={isAddressesLoading || !addresses || addresses.length === 0}
            className={`w-full h-14 pl-4 pr-10 bg-[#f7f9fb] dark:bg-[#131b2e] border ${errors.address ? 'border-red-500 ring-2 ring-red-500/50' : 'border-[#bec8d1] dark:border-slate-700 focus:ring-[#006590] dark:focus:ring-sky-500 focus:border-[#006590] dark:focus:border-sky-500'} rounded-2xl focus:ring-2 transition-all text-base outline-none appearance-none disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 text-gray-900 dark:text-white`}
          >
            {isAddressesLoading ? (
              <option value="" disabled>Loading addresses...</option>
            ) : !addresses || addresses.length === 0 ? (
              <option value="" disabled>No addresses found</option>
            ) : (
              <>
                <option value="" disabled>Select an address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.addressLine} - {address.city}
                  </option>
                ))}
              </>
            )}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-slate-400 w-5 h-5" />
        </div>

        {!isAddressesLoading && (!addresses || addresses.length === 0) && (
          <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              You must add a delivery address in your Profile before submitting a request.{' '}
              <Link to="/profile" className="font-bold underline hover:text-amber-800 dark:hover:text-amber-300">
                Go to Profile
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        id="prescription_upload"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading || !addresses || addresses.length === 0}
          className="w-full h-14 bg-[#009ada] dark:bg-sky-600 text-white font-bold text-lg rounded-2xl hover:bg-[#006590] dark:hover:bg-sky-500 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit Request
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
