import React, { useState } from 'react';
import { User, Mail, Phone, Pencil, FileText, Package, AlertCircle } from 'lucide-react';
import { usePatientProfileQuery } from '../hooks/useProfileQueries';
import EditProfileModal from './EditProfileModal';

export default function ProfileDetailsCard() {
  const { data: profile, isLoading, isError } = usePatientProfileQuery();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 animate-pulse">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
            <div className="space-y-3">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-36 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="bg-red-50 text-red-600 rounded-xl border border-red-100 p-6 mb-8">
        Failed to load profile details. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
            title="Edit Profile"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
            <User className="w-8 h-8" />
          </div>
          
          <div className="pt-1">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{profile.fullName}</h2>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {profile.phoneNumber ? (
                  <span className="text-sm">{profile.phoneNumber}</span>
                ) : (
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium"
                  >
                    No phone number provided (Add Phone)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-6 border-t border-gray-100">
          <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4 flex items-center gap-4 transition-colors hover:bg-teal-50">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-teal-600/80 font-medium mb-0.5">Total Requests</p>
              <p className="text-xl font-bold text-teal-900 leading-none">{profile.totalPrescriptionRequests}</p>
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-4 transition-colors hover:bg-blue-50">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-blue-600/80 font-medium mb-0.5">Orders</p>
              <p className="text-xl font-bold text-blue-900 leading-none">{profile.ordersCount}</p>
            </div>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 flex items-center gap-4 transition-colors hover:bg-orange-50">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-orange-600/80 font-medium mb-0.5">Complaints</p>
              <p className="text-xl font-bold text-orange-900 leading-none">{profile.complaintsSubmitted}</p>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
      />
    </>
  );
}
