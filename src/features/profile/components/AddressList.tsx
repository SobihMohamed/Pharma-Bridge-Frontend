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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="space-y-2 flex-1 pt-1">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
        Failed to load addresses. Please try again.
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No addresses added yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm text-center px-4">
            Add your delivery addresses to make requesting prescriptions faster and easier.
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
        <AddAddressModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Saved Addresses</h3>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard 
              key={addr.id} 
              address={addr} 
              onEdit={(address) => setEditingAddress(address)}
            />
          ))}
        </div>
      </div>
      <AddAddressModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditAddressModal 
        isOpen={!!editingAddress} 
        onClose={() => setEditingAddress(null)} 
        address={editingAddress} 
      />
    </>
  );
}
