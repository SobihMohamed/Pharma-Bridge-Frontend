import AddressCard from './AddressCard';
import { AddressDto } from '../types';

interface AddressListProps {
  addresses: AddressDto[];
  onEdit: (address: AddressDto) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function AddressList({ addresses, onEdit, onDelete, onSetDefault }: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-sm text-gray-500">No addresses saved yet.</p>
      </div>
    );
  }

  // Sort so default is always first
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedAddresses.map((address) => (
        <AddressCard 
          key={address.id} 
          address={address} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
