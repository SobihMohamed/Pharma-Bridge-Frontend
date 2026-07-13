import React, { useState } from 'react';
import { MapPin, Star, Pencil, Trash2, CheckCircle, AlertTriangle, MoreVertical } from 'lucide-react';
import { PatientAddressDto } from '../types';
import { useDeleteAddressMutation, useSetDefaultAddressMutation } from '../hooks/useAddressMutations';

interface AddressCardProps {
  address: PatientAddressDto;
  onEdit: (address: PatientAddressDto) => void;
}

export default function AddressCard({ address, onEdit }: AddressCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddressMutation();
  const { mutate: setDefaultAddress, isPending: isSettingDefault } = useSetDefaultAddressMutation();

  const handleDelete = () => {
    deleteAddress(address.id, {
      onSuccess: () => setIsDeleteDialogOpen(false)
    });
  };

  const handleSetDefault = () => {
    setDefaultAddress(address.id);
    setShowMenu(false);
  };

  return (
    <>
      <div
        className={`bg-white p-6 flex items-start gap-4 group cursor-pointer shadow-sm relative rounded-2xl transition-all hover:shadow-md ${
          address.isDefault
            ? 'border-2 border-[#009ADA]'
            : 'border border-gray-200'
        }`}
      >
        {/* Location Icon */}
        <div className="w-12 h-12 rounded-full bg-[#009ADA]/10 flex items-center justify-center text-[#009ADA] shrink-0">
          <MapPin className="w-5 h-5" />
        </div>

        {/* Address Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-bold text-gray-900 truncate">{address.city}</h4>
            {address.isDefault && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-sky-50 text-[#006591] text-[10px] font-bold uppercase flex items-center gap-1 border border-sky-200">
                <Star className="w-3 h-3 fill-[#009ADA] text-[#009ADA]" />
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{address.addressLine}</p>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-[#009ADA] transition-colors p-1"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-[160px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(address);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault();
                    }}
                    disabled={isSettingDefault}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isSettingDefault ? (
                      <div className="w-4 h-4 border-2 border-[#009ADA]/30 border-t-[#009ADA] rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Set Default
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
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
