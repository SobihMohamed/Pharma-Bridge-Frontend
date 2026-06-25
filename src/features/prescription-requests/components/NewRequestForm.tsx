import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, AlertTriangle } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Medicine Name or Image Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medicine Name <span className="text-gray-400 font-normal">(Optional if image provided)</span>
          </label>
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm outline-none transition-colors"
            placeholder="e.g. Panadol Extra"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prescription Image <span className="text-gray-400 font-normal">(Optional if name provided)</span>
          </label>
          
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-colors hover:border-teal-500 bg-gray-50"
            >
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <span className="relative rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                    Upload a file
                  </span>
                  <p className="ps-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          ) : (
            <div className="relative mt-1 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-2 flex items-center justify-center h-[142px]">
              <img 
                src={imagePreview} 
                alt="Prescription preview" 
                className="max-h-full object-contain rounded-md"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 end-2 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-sm backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes Field */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm outline-none transition-colors"
          placeholder="Any specific instructions for the pharmacy..."
        />
      </div>

      {/* Address Selection */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Address <span className="text-red-500">*</span>
        </label>
        
        <select
          id="address"
          value={deliveryAddressId}
          onChange={(e) => setDeliveryAddressId(Number(e.target.value))}
          disabled={isAddressesLoading || !addresses || addresses.length === 0}
          className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm outline-none transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-500"
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

        {!isAddressesLoading && (!addresses || addresses.length === 0) && (
          <div className="mt-3 flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>
              You must add a delivery address in your Profile before submitting a request.{' '}
              <Link to="/profile" className="font-bold underline hover:text-amber-700">
                Go to Profile
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading || !addresses || addresses.length === 0}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin -ms-1 me-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </div>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>
    </form>
  );
}
