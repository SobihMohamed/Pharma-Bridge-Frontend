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
        className={`bg-white dark:bg-[#0f172a] p-6 flex items-start gap-4 group cursor-pointer shadow-sm relative rounded-2xl transition-all hover:shadow-md ${
          address.isDefault
            ? 'border-2 border-[#009ADA] dark:border-sky-500'
            : 'border border-gray-200 dark:border-slate-800'
        }`}
      >
        {/* Location Icon */}
        <div className="w-12 h-12 rounded-full bg-[#009ADA]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#009ADA] dark:text-sky-400 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>

        {/* Address Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">{address.city}</h4>
            {address.isDefault && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-[#006591] dark:text-sky-400 text-[10px] font-bold uppercase flex items-center gap-1 border border-sky-200 dark:border-sky-800">
                <Star className="w-3 h-3 fill-[#009ADA] text-[#009ADA] dark:fill-sky-400 dark:text-sky-400" />
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{address.addressLine}</p>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 dark:text-slate-500 hover:text-[#009ADA] dark:hover:text-sky-400 transition-colors p-1"
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
              <div className="absolute right-0 top-8 z-20 bg-white dark:bg-[#0f172a] rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden min-w-[160px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(address);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
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
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50"
                  >
                    {isSettingDefault ? (
                      <div className="w-4 h-4 border-2 border-[#009ADA]/30 dark:border-sky-500/30 border-t-[#009ADA] dark:border-t-sky-500 rounded-full animate-spin" />
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
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
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
          <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 dark:border dark:border-slate-800">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Address?</h2>
                  <p className="text-gray-600 dark:text-slate-400 text-sm">
                    Are you sure you want to delete this address? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 bg-white dark:bg-[#131b2e] rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
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
