import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import { CreatePrescriptionRequestDto } from '../types';

interface NewRequestFormProps {
  onSubmit: (data: CreatePrescriptionRequestDto) => Promise<void>;
  isLoading: boolean;
}

export default function NewRequestForm({ onSubmit, isLoading }: NewRequestFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [deliveryAddressId, setDeliveryAddressId] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError('Please upload a prescription image.');
      return;
    }

    if (!deliveryAddressId) {
      setError('Please select a delivery address.');
      return;
    }

    await onSubmit({
      image,
      notes,
      deliveryAddressId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prescription Image <span className="text-red-500">*</span>
        </label>
        
        {!imagePreview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              error && !image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-teal-500 bg-gray-50'
            }`}
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
          <div className="relative mt-1 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 p-2 flex items-center justify-center">
            <img 
              src={imagePreview} 
              alt="Prescription preview" 
              className="max-h-64 object-contain rounded-md"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-4 end-4 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow-sm backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {error && !image && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Notes Field */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows={4}
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
          onChange={(e) => setDeliveryAddressId(e.target.value)}
          className={`block w-full rounded-md border px-4 py-3 text-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm outline-none transition-colors bg-white ${
            error && !deliveryAddressId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="" disabled>Select an address</option>
          <option value="addr_1">Home - 123 Main St, Apt 4B</option>
          <option value="addr_2">Work - 456 Business Blvd, Floor 2</option>
        </select>
        {error && !deliveryAddressId && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
          disabled={isLoading}
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
