import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { usePatientAddressesQuery } from '../hooks/useAddressQueries';
import AddressCard from './AddressCard';
import AddAddressModal from './AddAddressModal';
import EditAddressModal from './EditAddressModal';
import { PatientAddressDto } from '../types';

export default function AddressList() {
  const { data: addresses, isLoading, isError } = usePatientAddressesQuery();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<PatientAddressDto | null>(null);

  if (isLoading) {
    return (
      <section>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-36 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Delivery Addresses</h3>
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">
          Failed to load addresses. Please try again.
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Saved Delivery Addresses</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#006591] text-white font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Existing address cards */}
          {addresses?.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={(address) => setEditingAddress(address)}
            />
          ))}

          {/* Add placeholder card */}
          <div
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white/50 p-6 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#009ADA] hover:text-[#009ADA] transition-colors cursor-pointer group rounded-2xl min-h-[120px]"
          >
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-8 h-8" />
              <span className="text-sm font-semibold">
                {(!addresses || addresses.length === 0) ? 'Add your first address' : 'Add another address'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <AddAddressModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditAddressModal
        isOpen={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        address={editingAddress}
      />
    </>
  );
}
