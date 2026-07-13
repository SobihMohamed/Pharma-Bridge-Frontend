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

    if (!medicineName.trim() && !imageFile) {
      toast.error('Please provide at least a medicine name or upload an image.');
      return;
    }

    if (!deliveryAddressId) {
      toast.error('Please select a delivery address.');
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
          <label className="text-sm font-semibold text-gray-900 tracking-wide">
            Medicine Name <span className="text-gray-500 font-normal">(Optional if image provided)</span>
          </label>
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="w-full h-14 px-4 bg-[#f7f9fb] border border-[#bec8d1] rounded-2xl focus:ring-2 focus:ring-[#006590] focus:border-[#006590] transition-all text-base outline-none text-gray-900"
            placeholder="e.g. Panadol Extra"
          />
        </div>

        {/* Upload Zone */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900 tracking-wide">
            Prescription Image <span className="text-gray-500 font-normal">(Optional if name provided)</span>
          </label>
          
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#006590]', 'bg-[#006590]/5'); }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[#006590]', 'bg-[#006590]/5'); }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-[#006590]', 'bg-[#006590]/5');
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              className="group relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-[#bec8d1] rounded-2xl bg-[#f2f4f6] hover:bg-[#eceef0] transition-all cursor-pointer"
            >
              <CloudUpload className="text-[#006590] w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">
                <span className="text-[#006590] font-bold">Upload a file</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center h-48 border-2 border-solid border-[#006590] rounded-2xl bg-[#f7f9fb] p-2">
              <img 
                src={imagePreview} 
                alt="Prescription preview" 
                className="max-h-full object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-1.5 bg-white text-gray-700 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-sm font-semibold text-gray-900 tracking-wide">
          Additional Notes <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-4 bg-[#f7f9fb] border border-[#bec8d1] rounded-2xl focus:ring-2 focus:ring-[#006590] focus:border-[#006590] transition-all text-base outline-none resize-none text-gray-900"
          placeholder="Any specific instructions for the pharmacy..."
        />
      </div>

      {/* Delivery Address Dropdown */}
      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-sm font-semibold text-gray-900 tracking-wide">
          Delivery Address <span className="text-[#ba1a1a]">*</span>
        </label>
        
        <div className="relative group">
          <select
            id="address"
            value={deliveryAddressId}
            onChange={(e) => setDeliveryAddressId(Number(e.target.value))}
            disabled={isAddressesLoading || !addresses || addresses.length === 0}
            className="w-full h-14 pl-4 pr-10 bg-[#f7f9fb] border border-[#bec8d1] rounded-2xl focus:ring-2 focus:ring-[#006590] focus:border-[#006590] transition-all text-base outline-none appearance-none disabled:bg-gray-100 disabled:text-gray-500 text-gray-900"
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
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 w-5 h-5" />
        </div>

        {!isAddressesLoading && (!addresses || addresses.length === 0) && (
          <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              You must add a delivery address in your Profile before submitting a request.{' '}
              <Link to="/profile" className="font-bold underline hover:text-amber-800">
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
          className="w-full h-14 bg-[#009ada] text-white font-bold text-lg rounded-2xl hover:bg-[#006590] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
