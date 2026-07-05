import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { UploadCloud, Building2, MapPin, Phone, Clock, FileBadge, X, Loader2 } from 'lucide-react';
import { useRegisterPharmacyMutation, useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import MapLocationPicker from '@/shared/components/MapLocationPicker';
import { toast } from 'sonner';

interface PharmacyFormValues {
  pharmacyName: string;
  licenseNumber: string;
  contactPhone: string;
  area: string;
  textAddress: string;
  openTime: string;
  closeTime: string;
  is24Hours: boolean;
}

export default function RegisterPharmacyForm() {
  const { data: pharmacyProfile, isLoading: isProfileLoading } = useMyPharmacyProfileQuery();
  const { mutate: registerPharmacy, isPending } = useRegisterPharmacyMutation();
  
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PharmacyFormValues>({
    defaultValues: {
      pharmacyName: '',
      licenseNumber: '',
      contactPhone: '',
      area: '',
      textAddress: '',
      openTime: '08:00',
      closeTime: '22:00',
      is24Hours: false,
    }
  });

  const { register, handleSubmit, watch, reset } = form;
  const is24Hours = watch('is24Hours');

  useEffect(() => {
    if (pharmacyProfile) {
      // Aggressively unwrap in case the Axios interceptor returned the root response wrapper
      const actualProfile = (pharmacyProfile as any).data || pharmacyProfile;

      // Forcefully set each value individually to guarantee React-Hook-Form updates the UI
      form.setValue('pharmacyName', actualProfile.pharmacyName || '');
      form.setValue('licenseNumber', actualProfile.licenseNumber || '');
      form.setValue('contactPhone', actualProfile.contactPhone || '');
      form.setValue('area', actualProfile.area || '');
      form.setValue('textAddress', actualProfile.textAddress || '');
      form.setValue('openTime', actualProfile.openTime || '08:00');
      form.setValue('closeTime', actualProfile.closeTime || '22:00');
      form.setValue('is24Hours', actualProfile.is24Hours || false);
      
      // Hydrate local state for maps and images
      if (actualProfile.latitude && actualProfile.longitude) {
        setLocation({ lat: actualProfile.latitude, lng: actualProfile.longitude });
      }
      if (actualProfile.licenseImageUrl) {
        setImagePreview(actualProfile.licenseImageUrl);
      }
    }
  }, [pharmacyProfile, form]);

  const actualProfileStatus = (pharmacyProfile as any)?.data || pharmacyProfile;
  const isPendingStatus = actualProfileStatus?.status === 'Pending';
  const isApprovedStatus = actualProfileStatus?.status === 'Approved' || actualProfileStatus?.isApproved;
  const isReadOnly = isPendingStatus || isApprovedStatus;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setLicenseImage(null);
    if (imagePreview && !pharmacyProfile?.licenseImageUrl) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (values: PharmacyFormValues) => {
    if (!location) {
      toast.error('Please select your pharmacy location on the map.');
      return;
    }
    if (!licenseImage) {
      toast.error('Please upload your pharmacy license image.');
      return;
    }
    
    // Map camelCase form values back to PascalCase for the backend DTO
    registerPharmacy({
      PharmacyName: values.pharmacyName,
      LicenseNumber: values.licenseNumber,
      ContactPhone: values.contactPhone,
      Area: values.area,
      TextAddress: values.textAddress,
      OpenTime: values.openTime,
      CloseTime: values.closeTime,
      Is24Hours: values.is24Hours,
      Latitude: location.lat,
      Longitude: location.lng,
      LicenseImage: licenseImage,
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Pharmacy Location & Registration</h2>
          <p className="text-sm text-gray-500">
            Manage your pharmacy location, credentials, and operating hours.
          </p>
        </div>
        {isApprovedStatus && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-bold text-sm shadow-sm">
            Status: {actualProfileStatus?.status || 'Active'} 🏪
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
            <Building2 className="w-5 h-5 text-teal-600" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pharmacy Name</label>
              <input
                {...register('pharmacyName', { required: true })}
                disabled={isReadOnly}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g. El-Ezaby Pharmacy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">License Number</label>
              <input
                {...register('licenseNumber', { required: true })}
                disabled={isReadOnly}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g. L-12345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('contactPhone', { required: true })}
                  disabled={isReadOnly}
                  className="block w-full pl-10 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="010XXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
            <FileBadge className="w-5 h-5 text-teal-600" />
            License Document
          </h3>

          {!imagePreview ? (
            <div
              onClick={() => !isReadOnly && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 ${isReadOnly ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-teal-400 bg-gray-50/50 hover:bg-teal-50/30'}`}
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
                disabled={isReadOnly}
                className={`absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm ${isReadOnly ? 'hidden' : 'text-gray-600 hover:text-red-500'}`}
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
            <MapPin className="w-5 h-5 text-teal-600" />
            Location & Operations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
              <input
                {...register('textAddress', { required: true })}
                disabled={isReadOnly}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Area</label>
              <input
                {...register('area', { required: true })}
                disabled={isReadOnly}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Location</label>
            <div className={isReadOnly ? 'pointer-events-none opacity-80' : ''}>
              <MapLocationPicker
                initialLat={location?.lat}
                initialLng={location?.lng}
                onLocationChange={(lat, lng) => setLocation({ lat, lng })}
              />
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" /> Operating Hours
              </h4>
              <label className="flex items-center cursor-pointer">
                <span className="text-sm font-medium text-gray-600 mr-3">24 Hours</span>
                <div className="relative">
                  <input type="checkbox" {...register('is24Hours')} disabled={isReadOnly} className="sr-only" />
                  <div className={`block w-11 h-6 rounded-full ${is24Hours ? 'bg-teal-600' : 'bg-gray-300'} ${isReadOnly ? 'opacity-50' : ''}`} />
                  <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${is24Hours ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </label>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${is24Hours ? 'opacity-40 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Open Time</label>
                <input
                  type="time"
                  {...register('openTime', { required: !is24Hours })}
                  disabled={is24Hours || isReadOnly}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Close Time</label>
                <input
                  type="time"
                  {...register('closeTime', { required: !is24Hours })}
                  disabled={is24Hours || isReadOnly}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          {isPendingStatus && (
            <div className="w-full text-center p-3 bg-blue-50 border border-blue-200 text-blue-700 font-medium rounded-xl">
              Your pharmacy is currently under review.
            </div>
          )}
          {!isReadOnly && (
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700 font-semibold disabled:opacity-60 transition-all min-w-[200px]"
            >
              {isPending ? 'Submitting...' : 'Register Pharmacy'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
