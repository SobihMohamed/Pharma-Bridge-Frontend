import React, { useState, useRef } from 'react';
import { UploadCloud, Building2, MapPin, Phone, Clock, FileBadge, X } from 'lucide-react';
import { useRegisterPharmacyMutation } from '../hooks/usePharmacyProfile';
import MapLocationPicker from '@/shared/components/MapLocationPicker';
import { toast } from 'sonner';

export default function RegisterPharmacyForm() {
  const [formData, setFormData] = useState({
    PharmacyName: '',
    LicenseNumber: '',
    ContactPhone: '',
    Area: '',
    TextAddress: '',
    OpenTime: '08:00',
    CloseTime: '22:00',
    Is24Hours: false,
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: registerPharmacy, isPending } = useRegisterPharmacyMutation();

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
    if (!licenseImage) {
      toast.error('Please upload your pharmacy license image.');
      return;
    }

    registerPharmacy({
      ...formData,
      Latitude: location.lat,
      Longitude: location.lng,
      LicenseImage: licenseImage,
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Register Your Pharmacy</h2>
        <p className="text-sm text-gray-500">
          Join our network to receive prescription requests from nearby patients.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
            <Building2 className="w-5 h-5 text-teal-600" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="PharmacyName" className="block text-sm font-medium text-gray-700 mb-1.5">Pharmacy Name</label>
              <input
                id="PharmacyName"
                required
                type="text"
                name="PharmacyName"
                value={formData.PharmacyName}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
                placeholder="e.g. El-Ezaby Pharmacy"
              />
            </div>
            <div>
              <label htmlFor="LicenseNumber" className="block text-sm font-medium text-gray-700 mb-1.5">License Number</label>
              <input
                id="LicenseNumber"
                required
                type="text"
                name="LicenseNumber"
                value={formData.LicenseNumber}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
                placeholder="e.g. L-12345678"
              />
            </div>
            <div>
              <label htmlFor="ContactPhone" className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="ContactPhone"
                  required
                  type="tel"
                  name="ContactPhone"
                  value={formData.ContactPhone}
                  onChange={handleInputChange}
                  className="block w-full pl-10 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
                  placeholder="010XXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: License Document */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
            <FileBadge className="w-5 h-5 text-teal-600" />
            License Document
          </h3>

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-400 bg-gray-50/50 hover:bg-teal-50/30 transition-all duration-200"
            >
              <UploadCloud className="h-10 w-10 text-teal-600/60 mb-2" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-teal-600">Click to upload</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          ) : (
            <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
              <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 bg-white text-gray-600 hover:text-red-500 rounded-full shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
          />
        </div>

        {/* Card 3: Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-teal-600" />
            Location & Operations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label htmlFor="TextAddress" className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
              <input
                id="TextAddress"
                required
                type="text"
                name="TextAddress"
                value={formData.TextAddress}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="Area" className="block text-sm font-medium text-gray-700 mb-1.5">Area</label>
              <input
                id="Area"
                required
                type="text"
                name="Area"
                value={formData.Area}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Location</label>
            <MapLocationPicker
              initialLat={location?.lat}
              initialLng={location?.lng}
              onLocationChange={(lat, lng) => setLocation({ lat, lng })}
            />
          </div>

          <div className="pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" /> Operating Hours
              </h4>
              <label className="flex items-center cursor-pointer">
                <span className="text-sm font-medium text-gray-600 mr-3">24 Hours</span>
                <div className="relative">
                  <input type="checkbox" name="Is24Hours" checked={formData.Is24Hours} onChange={handleInputChange} className="sr-only" />
                  <div className={`block w-11 h-6 rounded-full ${formData.Is24Hours ? 'bg-teal-600' : 'bg-gray-300'}`} />
                  <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${formData.Is24Hours ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </label>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${formData.Is24Hours ? 'opacity-40 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Open Time</label>
                <input
                  type="time"
                  name="OpenTime"
                  value={formData.OpenTime}
                  disabled={formData.Is24Hours}
                  required={!formData.Is24Hours}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Close Time</label>
                <input
                  type="time"
                  name="CloseTime"
                  value={formData.CloseTime}
                  disabled={formData.Is24Hours}
                  required={!formData.Is24Hours}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700 font-semibold disabled:opacity-60 transition-all min-w-[200px]"
          >
            {isPending ? 'Submitting...' : 'Register Pharmacy'}
          </button>
        </div>
      </form>
    </div>
  );
}
