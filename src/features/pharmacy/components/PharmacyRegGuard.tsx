import React from 'react';
import { ShieldAlert, Clock, CheckCircle2, XCircle, Lock, Loader2 } from 'lucide-react';
import { usePharmaOwnerProfileQuery } from '../hooks/useOwnerProfile';
import { useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import RegisterPharmacyForm from './RegisterPharmacyForm';
import PharmacyStatusDashboard from './PharmacyStatusDashboard';

export default function PharmacyRegGuard() {
  const { data: ownerProfile, isLoading: isOwnerLoading } = usePharmaOwnerProfileQuery();

  if (isOwnerLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  // --- Step 1: Guard against missing or unapproved Owner Profile ---

  if (!ownerProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-5">
          <ShieldAlert className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Required</h3>
        <p className="text-gray-500 max-w-md leading-relaxed">
          Please complete your <span className="font-semibold text-gray-700">Personal Business Profile</span> first
          to unlock Pharmacy Registration. Switch to the "Personal Profile" tab to get started.
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          <Lock className="w-4 h-4" />
          Registration is locked until your profile is submitted
        </div>
      </div>
    );
  }

  if (ownerProfile.status === 'Pending') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Under Review</h3>
        <p className="text-gray-500 max-w-md leading-relaxed">
          Your personal profile is currently being reviewed by our administration team.
          Once <span className="font-semibold text-gray-700">Approved</span>, you will be able to register your pharmacy here.
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
          <Clock className="w-4 h-4" />
          Estimated review time: 1–3 business days
        </div>
      </div>
    );
  }

  if (ownerProfile.status === 'Rejected') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Rejected</h3>
        <p className="text-gray-500 max-w-md leading-relaxed">
          Unfortunately, your profile has been rejected. Please update your details in the
          <span className="font-semibold text-gray-700"> Personal Profile</span> tab and resubmit for review.
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <XCircle className="w-4 h-4" />
          Registration is locked until your profile is approved
        </div>
      </div>
    );
  }

  // --- Step 2: Owner Profile is Approved. Render Unified Form ---
  return <RegisterPharmacyForm />;
}
