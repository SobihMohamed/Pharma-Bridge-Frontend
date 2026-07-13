import React, { useState, useEffect, useRef } from 'react';
import { User, CreditCard, FileCheck, Loader2, Shield, AlertCircle, Clock, CheckCircle2, XCircle, UploadCloud, ImageIcon, X, Mail } from 'lucide-react';
import {
  usePharmaOwnerProfileQuery,
  useCreateOwnerProfileMutation,
  useUpdateOwnerProfileMutation,
} from '../hooks/useOwnerProfile';
import { OwnerProfileStatus } from '../types/ownerProfile';
import { useAuthStore } from '@/features/auth/store/authStore';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<OwnerProfileStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Pending: {
    label: 'Pending Review',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30',
    icon: <Clock className="w-4 h-4" />,
  },
  Approved: {
    label: 'Approved',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  Rejected: {
    label: 'Rejected',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30',
    icon: <XCircle className="w-4 h-4" />,
  },
};

interface FileFieldProps {
  label: string;
  id: string;
  file: File | null;
  existingUrl: string | null;
  required: boolean;
  onFileSelect: (file: File | null) => void;
}

function FileUploadField({ label, id, file, existingUrl, required, onFileSelect }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  const displayUrl = preview || existingUrl;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>

      {/* Current image thumbnail */}
      {displayUrl && (
        <div className="relative mb-2 w-full">
          <div className="w-full aspect-video rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
            <img
              src={displayUrl}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          {file && (
            <button
              type="button"
              onClick={() => {
                onFileSelect(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="absolute -top-2 -right-2 p-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-450 hover:text-red-500 dark:hover:text-red-400 rounded-full shadow-sm transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {!file && existingUrl && (
            <div className="mt-1">
              <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Current file on server
              </span>
            </div>
          )}
        </div>
      )}

      {/* File input trigger */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-teal-400 dark:hover:border-teal-500 bg-gray-50/50 dark:bg-slate-950 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition-all duration-200"
      >
        <UploadCloud className="w-5 h-5 text-teal-600/60 dark:text-teal-400/60 shrink-0" />
        <div className="min-w-0 flex-1">
          {file ? (
            <p className="text-sm text-gray-700 dark:text-slate-200 font-medium truncate">{file.name}</p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              <span className="font-medium text-teal-600 dark:text-teal-400">Choose file</span>
              {!required && existingUrl && ' (optional — leave empty to keep current)'}
            </p>
          )}
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">PNG, JPG up to 5MB</p>
        </div>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        required={required}
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0] || null;
          onFileSelect(selected);
        }}
      />
    </div>
  );
}

export default function OwnerProfileForm() {
  const { data: profile, isLoading, isError } = usePharmaOwnerProfileQuery();
  const { mutate: createProfile, isPending: isCreating } = useCreateOwnerProfileMutation();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateOwnerProfileMutation();
  const authUser = useAuthStore((state) => state.user);

  const isExistingProfile = profile !== null && profile !== undefined;
  const isPending = isCreating || isUpdating;

  // Text fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalId, setNationalId] = useState('');

  // File fields
  const [nationalIdFront, setNationalIdFront] = useState<File | null>(null);
  const [nationalIdBack, setNationalIdBack] = useState<File | null>(null);
  const [syndicateCardImage, setSyndicateCardImage] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhoneNumber(profile.phoneNumber || '');
      setNationalId(profile.nationalId || '');
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isExistingProfile) {
      updateProfile({
        fullName,
        phoneNumber,
        nationalId,
        nationalIdFront,
        nationalIdBack,
        syndicateCardImage,
      });
    } else {
      if (!nationalIdFront || !nationalIdBack || !syndicateCardImage) {
        toast.error('Please upload all required document images.');
        return;
      }
      createProfile({
        nationalId,
        nationalIdFront,
        nationalIdBack,
        syndicateCardImage,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-600 dark:text-red-400">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p className="text-lg font-semibold">Failed to load profile</p>
        <p className="text-sm text-gray-500 dark:text-slate-400">Please refresh the page and try again.</p>
      </div>
    );
  }

  const statusInfo = profile?.status ? STATUS_CONFIG[profile.status] : null;

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      {statusInfo && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${statusInfo.bg}`}>
          <div className={statusInfo.color}>{statusInfo.icon}</div>
          <div>
            <p className={`text-sm font-bold ${statusInfo.color}`}>
              Profile Status: {statusInfo.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              {profile?.status === 'Pending' && 'Your profile is being reviewed by our administration team.'}
              {profile?.status === 'Approved' && 'Your profile has been verified. You can now register a pharmacy.'}
              {profile?.status === 'Rejected' && 'Your profile was rejected. Please update your details and resubmit.'}
            </p>
          </div>
        </div>
      )}

      {!isExistingProfile && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Complete your personal business profile to unlock pharmacy registration.
          </p>
        </div>
      )}

      {/* Read-only identity info from auth store — shown in Create mode */}
      {!isExistingProfile && authUser && (
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Full Name</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-sm text-gray-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                {authUser.name}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Email Address</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-sm text-gray-700 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                {authUser.email}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">These details come from your account and cannot be edited here.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details — Only shown for updates */}
        {isExistingProfile && (
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
              <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input
                  id="fullName"
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Your full legal name"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                <input
                  id="phoneNumber"
                  required
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="010XXXXXXXX"
                />
              </div>
            </div>
          </div>
        )}

        {/* National ID Section */}
        <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            National ID Verification
          </h3>
          <div className="space-y-5">
            <div>
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">National ID Number</label>
              <input
                id="nationalId"
                required
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 text-gray-900 dark:text-white dark:bg-slate-950 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="14-digit National ID"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FileUploadField
                label="National ID — Front"
                id="nationalIdFront"
                file={nationalIdFront}
                existingUrl={profile?.nationalIdFront || null}
                required={!isExistingProfile}
                onFileSelect={setNationalIdFront}
              />
              <FileUploadField
                label="National ID — Back"
                id="nationalIdBack"
                file={nationalIdBack}
                existingUrl={profile?.nationalIdBack || null}
                required={!isExistingProfile}
                onFileSelect={setNationalIdBack}
              />
            </div>
          </div>
        </div>

        {/* Syndicate Card */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <FileCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Syndicate Card
          </h3>
          <FileUploadField
            label="Syndicate Card Image"
            id="syndicateCardImage"
            file={syndicateCardImage}
            existingUrl={profile?.syndicateCardImage || null}
            required={!isExistingProfile}
            onFileSelect={setSyndicateCardImage}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all min-w-[180px]"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </div>
            ) : isExistingProfile ? (
              'Update Profile'
            ) : (
              'Submit Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
