import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AddressDto, CreateUpdateAddressDto } from '../types';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: AddressDto | null;
  onSave: (data: CreateUpdateAddressDto) => Promise<void>;
}

const defaultState: CreateUpdateAddressDto = {
  city: '',
  area: '',
  street: '',
  building: '',
  isDefault: false,
};

export default function AddressFormModal({ isOpen, onClose, address, onSave }: AddressFormModalProps) {
  const [formData, setFormData] = useState<CreateUpdateAddressDto>(defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (address) {
        setFormData({
          city: address.city,
          area: address.area,
          street: address.street,
          building: address.building,
          isDefault: address.isDefault,
        });
      } else {
        setFormData(defaultState);
      }
    }
  }, [isOpen, address]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {address ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-5">
          <form id="address-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area / Neighborhood
              </label>
              <input
                id="area"
                name="area"
                type="text"
                required
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Street Name
              </label>
              <input
                id="street"
                name="street"
                type="text"
                required
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                Building / Apartment No.
              </label>
              <input
                id="building"
                name="building"
                type="text"
                required
                value={formData.building}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="isDefault"
                name="isDefault"
                type="checkbox"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as default delivery address
              </label>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="address-form"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 flex justify-center items-center transition-colors"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Save Address'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
