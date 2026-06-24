import { MapPin, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { AddressDto } from '../types';

interface AddressCardProps {
  address: AddressDto;
  onEdit: (address: AddressDto) => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all relative ${
      address.isDefault ? 'border-teal-500 ring-1 ring-teal-500' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {address.isDefault && (
        <div className="absolute top-0 end-0 bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wide flex items-center gap-1 shadow-sm">
          <CheckCircle className="w-3 h-3" />
          Default
        </div>
      )}
      
      <div className="p-5 flex gap-4">
        <div className="shrink-0 mt-1">
          <div className={`p-2 rounded-full ${address.isDefault ? 'bg-teal-50' : 'bg-gray-100'}`}>
            <MapPin className={`w-5 h-5 ${address.isDefault ? 'text-teal-600' : 'text-gray-500'}`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 mb-1">{address.building}, {address.street}</div>
          <div className="text-sm text-gray-500">{address.area}, {address.city}</div>
        </div>
      </div>
      
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        {!address.isDefault && onSetDefault ? (
          <button 
            onClick={() => onSetDefault(address.id)}
            className="text-xs font-medium text-gray-500 hover:text-teal-600 transition-colors"
          >
            Set as Default
          </button>
        ) : <div />}
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onEdit(address)}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(address.id)}
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
