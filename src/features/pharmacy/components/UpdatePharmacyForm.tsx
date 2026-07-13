import React, { useState, useRef } from 'react';
import { UploadCloud, Building2, MapPin, Phone, Clock, FileBadge, X, ImageIcon } from 'lucide-react';
import { useUpdatePharmacyMutation } from '../hooks/usePharmacyProfile';
import { PharmacyProfileDto } from '../types';
import MapLocationPicker from '@/shared/components/MapLocationPicker';
import { toast } from 'sonner';

interface UpdatePharmacyFormProps {
  initialData: PharmacyProfileDto;
  onCancel: () => void;
}

export default function UpdatePharmacyForm({ initialData, onCancel }: UpdatePharmacyFormProps) {
  const [formData, setFormData] = useState({
    PharmacyName: initialData.pharmacyName || '',
    LicenseNumber: initialData.licenseNumber || '',
    ContactPhone: initialData.contactPhone || '',
    Area: initialData.area || '',
    TextAddress: initialData.textAddress || '',
    OpenTime: initialData.openTime ? initialData.openTime.slice(0, 5) : '',
    CloseTime: initialData.closeTime ? initialData.closeTime.slice(0, 5) : '',
    Is24Hours: initialData.is24Hours || false,
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>({
    lat: initialData.latitude,
    lng: initialData.longitude,
  });
  
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updatePharmacy, isPending } = useUpdatePharmacyMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = e.target.checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === 'Is24Hours' && checked ? { OpenTime: '', CloseTime: '' } : {}),
        ...(name === 'Is24Hours' && !checked ? { OpenTime: '08:00', CloseTime: '22:00' } : {}),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const clearImage = () => {
    setLicenseImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location) {
      toast.error('Please select your pharmacy location on the map.');
      return;
    }

    updatePharmacy(
      {
        ...formData,
        Latitude: location.lat,
        Longitude: location.lng,
        LicenseImage: licenseImage,
      },
      {
        onSuccess: () => {
          onCancel(); // Return to dashboard view
        },
      }
    );
  };

  const displayImage = imagePreview || initialData.licenseImageUrl;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Edit Pharmacy</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Update your pharmacy details.</p>
        </div>
        <button
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Basic Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Pharmacy Name</label>
              <input
                required
                type="text"
                name="PharmacyName"
                value={formData.PharmacyName}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 focus:ring-teal-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">License Number</label>
              <input
                required
                type="text"
                name="LicenseNumber"
                value={formData.LicenseNumber}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 focus:ring-teal-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Contact Phone</label>
              <input
                required
                type="tel"
                name="ContactPhone"
                value={formData.ContactPhone}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 focus:ring-teal-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Card 2: License Document */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <FileBadge className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            License Document
          </h3>

          <div className="mb-4">
            <div className="relative rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden bg-gray-50 dark:bg-slate-950 h-48 flex items-center justify-center">
              <img src={displayImage} alt="License" className="max-h-full max-w-full object-contain" />
              {licenseImage && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 rounded-full shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {!licenseImage && (
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-gray-400 dark:text-slate-500" /> Current license on server
              </p>
            )}
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-teal-400 dark:hover:border-teal-500 bg-gray-50 dark:bg-slate-950 hover:bg-teal-50/50 dark:hover:bg-teal-950/20"
          >
            <UploadCloud className="w-5 h-5 text-teal-600/60 dark:text-teal-400/60" />
            <div className="text-sm">
              <span className="font-medium text-teal-600 dark:text-teal-400">Upload new license</span> (optional)
              <p className="text-xs text-gray-400 dark:text-slate-500">PNG, JPG up to 5MB</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
          />
        </div>

        {/* Card 3: Location */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Location & Operations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Street Address</label>
              <input
                required
                type="text"
                name="TextAddress"
                value={formData.TextAddress}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 focus:ring-teal-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Area</label>
              <input
                required
                type="text"
                name="Area"
                value={formData.Area}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 focus:ring-teal-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Location</label>
            <MapLocationPicker
              initialLat={location?.lat}
              initialLng={location?.lng}
              onLocationChange={(lat, lng) => setLocation({ lat, lng })}
            />
          </div>

          <div className="pt-5 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Hours
              </h4>
              <label className="flex items-center cursor-pointer">
                <span className="text-sm font-medium text-gray-600 dark:text-slate-400 mr-3">24 Hours</span>
                <div className="relative">
                  <input type="checkbox" name="Is24Hours" checked={formData.Is24Hours} onChange={handleInputChange} className="sr-only" />
                  <div className={`block w-11 h-6 rounded-full ${formData.Is24Hours ? 'bg-teal-600 dark:bg-teal-500' : 'bg-gray-300 dark:bg-slate-700'}`} />
                  <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${formData.Is24Hours ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </label>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${formData.Is24Hours ? 'opacity-40 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Open Time</label>
                <input
                  type="time"
                  name="OpenTime"
                  value={formData.OpenTime}
                  disabled={formData.Is24Hours}
                  required={!formData.Is24Hours}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 disabled:bg-gray-100 dark:disabled:bg-slate-900/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Close Time</label>
                <input
                  type="time"
                  name="CloseTime"
                  value={formData.CloseTime}
                  disabled={formData.Is24Hours}
                  required={!formData.Is24Hours}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 disabled:bg-gray-100 dark:disabled:bg-slate-900/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 font-semibold disabled:opacity-60 transition-all min-w-[200px]"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
