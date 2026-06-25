import React, { useState } from 'react';
import { MapPin, Star, Pencil, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { PatientAddressDto } from '../types';
import { useDeleteAddressMutation, useSetDefaultAddressMutation } from '../hooks/useAddressMutations';

interface AddressCardProps {
  address: PatientAddressDto;
  onEdit: (address: PatientAddressDto) => void;
}

export default function AddressCard({ address, onEdit }: AddressCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddressMutation();
  const { mutate: setDefaultAddress, isPending: isSettingDefault } = useSetDefaultAddressMutation();

  const handleDelete = () => {
    deleteAddress(address.id, {
      onSuccess: () => setIsDeleteDialogOpen(false)
    });
  };

  const handleSetDefault = () => {
    setDefaultAddress(address.id);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {address.isDefault ? (
            <div className="flex items-center gap-1 bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-xs font-bold border border-teal-100">
              <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
              Default
            </div>
          ) : (
            <button
              onClick={handleSetDefault}
              disabled={isSettingDefault}
              className="flex items-center gap-1 bg-gray-50 text-gray-600 hover:text-teal-700 hover:bg-teal-50 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-200 hover:border-teal-100 transition-colors disabled:opacity-50"
            >
              {isSettingDefault ? (
                <div className="w-3.5 h-3.5 border-2 border-teal-600/30 border-t-teal-600 rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              Set Default
            </button>
          )}
          
          <button
            onClick={() => onEdit(address)}
            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
            title="Edit Address"
          >
            <Pencil className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 disabled:opacity-50"
            title="Delete Address"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-teal-600" />
        </div>
        <div className="pt-1 pr-16">
          <h3 className="font-bold text-gray-900 text-base mb-1">{address.city}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{address.addressLine}</p>
        </div>
      </div>
    </div>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Address?</h2>
                  <p className="text-gray-600 text-sm">
                    Are you sure you want to delete this address? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex justify-center items-center transition-colors disabled:opacity-70"
                >
                  {isDeleting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Yes, Delete it'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
