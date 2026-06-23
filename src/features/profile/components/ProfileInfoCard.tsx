import { User, Mail, Phone, Edit2 } from 'lucide-react';
import { PatientProfileDto } from '../types';

interface ProfileInfoCardProps {
  profile: PatientProfileDto;
  onEditClick: () => void;
}

export default function ProfileInfoCard({ profile, onEditClick }: ProfileInfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" />
          Personal Information
        </h2>
        <button 
          onClick={onEditClick}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-md transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-base font-semibold text-gray-900">{profile.name}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-base font-medium text-gray-900">{profile.email}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <p className="text-base font-medium text-gray-900">{profile.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
