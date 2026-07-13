import React, { useState } from 'react';
import { User, Mail, Phone, Pencil, FileText, Package, AlertCircle } from 'lucide-react';
import { usePatientProfileQuery } from '../hooks/useProfileQueries';
import EditProfileModal from './EditProfileModal';

export default function ProfileDetailsCard() {
  const { data: profile, isLoading, isError } = usePatientProfileQuery();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <section className="bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] border border-gray-200 relative overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center text-center gap-4 animate-pulse">
          <div className="w-32 h-32 rounded-2xl bg-gray-200" />
          <div className="space-y-2 w-full">
            <div className="h-6 w-40 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
          </div>
          <div className="w-full space-y-2 pt-4 border-t border-gray-100">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="bg-red-50 text-red-600 rounded-2xl border border-red-100 p-6">
        Failed to load profile details. Please try again later.
      </section>
    );
  }

  return (
    <>
      <section className="bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] border border-gray-200 relative overflow-hidden rounded-2xl">
        {/* Decorative blur circle */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#009ADA]/5 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center text-center gap-4 relative z-10">
          {/* Avatar with edit button */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-sky-100 flex items-center justify-center text-[#006591] overflow-hidden ring-4 ring-white shadow-md">
              <User className="w-16 h-16" />
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#006591] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              title="Edit Profile"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Name & ID */}
          <div>
            <h3 className="text-xl font-bold text-gray-900">{profile.fullName}</h3>
            <p className="text-sm text-gray-500 mt-1">Patient ID: #PB-{profile.id?.toString().slice(0, 5) || '---'}</p>
          </div>

          {/* Contact Info */}
          <div className="w-full space-y-2 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-gray-500">
              <Mail className="w-5 h-5 text-[#009ADA] shrink-0" />
              <span className="text-sm truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <Phone className="w-5 h-5 text-[#009ADA] shrink-0" />
              {profile.phoneNumber ? (
                <span className="text-sm">{profile.phoneNumber}</span>
              ) : (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-sm text-[#009ADA] hover:text-[#006591] hover:underline font-medium"
                >
                  Add phone number
                </button>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-sm rounded-lg transition-colors mt-4"
          >
            Edit Detailed Info
          </button>
        </div>
      </section>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
      />
    </>
  );
}
