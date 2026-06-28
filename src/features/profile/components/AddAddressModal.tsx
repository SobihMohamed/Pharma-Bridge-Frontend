import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useCreateAddressMutation } from '../hooks/useAddressMutations';
import MapLocationPicker from '@/shared/components/MapLocationPicker';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAddressModal({ isOpen, onClose }: AddAddressModalProps) {
  const [city, setCity] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDefault, setIsDefault] = useState(true);

  const { mutate: createAddress, isPending } = useCreateAddressMutation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    createAddress(
      {
        city,
        addressLine,
        latitude: location.lat,
        longitude: location.lng,
        isDefault
      },
      {
        onSuccess: () => {
          // Reset form
          setCity('');
          setAddressLine('');
          setIsDefault(true);
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Add New Address</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isPending}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Cairo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Street name, building number, apartment"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pin Location on Map <span className="text-red-500">*</span>
            </label>
            <MapLocationPicker 
              onLocationChange={(lat, lng) => setLocation({ lat, lng })} 
            />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <input
              id="isDefault"
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-teal-600 bg-white border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer select-none flex-1">
              Set as my default address
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !location || !city.trim() || !addressLine.trim()}
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Save Address'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
