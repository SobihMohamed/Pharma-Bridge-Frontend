import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import ProfileInfoCard from '../components/ProfileInfoCard';
import EditProfileModal from '../components/EditProfileModal';
import { PatientProfileDto, UpdateProfileDto } from '../types';

import AddressList from '@/features/address/components/AddressList';
import AddressFormModal from '@/features/address/components/AddressFormModal';
import { AddressDto, CreateUpdateAddressDto } from '@/features/address/types';

// Mock Initial Data
const MOCK_PROFILE: PatientProfileDto = {
  id: 'usr_1',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@example.com',
  phone: '+1 (555) 123-4567',
};

const MOCK_ADDRESSES: AddressDto[] = [
  {
    id: 'addr_1',
    city: 'New York',
    area: 'Manhattan',
    street: '123 Broadway Ave',
    building: 'Apt 4B',
    isDefault: true,
  },
  {
    id: 'addr_2',
    city: 'New York',
    area: 'Brooklyn',
    street: '456 Tech Place',
    building: 'Floor 2',
    isDefault: false,
  },
];

export default function ProfilePage() {
  // Profile State
  const [profile, setProfile] = useState<PatientProfileDto>(MOCK_PROFILE);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<AddressDto[]>(MOCK_ADDRESSES);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDto | null>(null);

  // Profile Handlers
  const handleSaveProfile = async (data: UpdateProfileDto) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile((prev) => ({ ...prev, ...data }));
    toast.success('Profile updated successfully!');
    setIsEditProfileOpen(false);
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (address: AddressDto) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (id: string) => {
    // Immediate optimistic delete for better UX, or can add a confirmation dialog
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success('Address deleted successfully!');
  };

  const handleSetDefaultAddress = async (id: string) => {
    setAddresses((prev) => 
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success('Default address updated!');
  };

  const handleSaveAddress = async (data: CreateUpdateAddressDto) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAddresses((prev) => {
      let updatedList = [...prev];
      
      // If setting this one as default, unset others
      if (data.isDefault) {
        updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
      }
      
      // If it's an edit
      if (editingAddress) {
        return updatedList.map(a => 
          a.id === editingAddress.id ? { ...data, id: a.id } : a
        );
      }
      
      // If it's new
      // If it's the first address, force it to be default
      const isFirst = prev.length === 0;
      return [...updatedList, { ...data, id: `addr_${Date.now()}`, isDefault: data.isDefault || isFirst }];
    });

    toast.success(editingAddress ? 'Address updated!' : 'New address added!');
    setIsAddressModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and delivery addresses.</p>
      </div>

      <section>
        <ProfileInfoCard 
          profile={profile} 
          onEditClick={() => setIsEditProfileOpen(true)} 
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
          <button 
            onClick={handleOpenAddAddress}
            className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
        
        <AddressList 
          addresses={addresses}
          onEdit={handleOpenEditAddress}
          onDelete={handleDeleteAddress}
          onSetDefault={handleSetDefaultAddress}
        />
      </section>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        address={editingAddress}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
