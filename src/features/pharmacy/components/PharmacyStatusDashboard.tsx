import React, { useState } from 'react';
import { Building2, MapPin, Phone, Clock, CheckCircle2, XCircle, AlertCircle, Edit } from 'lucide-react';
import { PharmacyProfileDto } from '../types';
import UpdatePharmacyForm from './UpdatePharmacyForm';

interface PharmacyStatusDashboardProps {
  data: PharmacyProfileDto;
}

export default function PharmacyStatusDashboard({ data }: PharmacyStatusDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <UpdatePharmacyForm initialData={data} onCancel={() => setIsEditing(false)} />;
  }

  const status = data.status || (data.isApproved ? 'Approved' : 'Pending');

  const getStatusBadge = () => {
    
    if (status === 'Active' || status === 'Approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30">
          <CheckCircle2 className="w-4 h-4" />
          {status}
        </span>
      );
    }
    
    if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30">
          <XCircle className="w-4 h-4" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30">
        <Clock className="w-4 h-4" />
        Pending Review
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-700 dark:text-teal-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.pharmacyName}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">License: {data.licenseNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge()}
          <button
            onClick={() => setIsEditing(true)}
            disabled={status === 'Pending'}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-50 dark:disabled:hover:bg-teal-950/30"
          >
            <Edit className="w-4 h-4" />
            Edit Info
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Contact & Location</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-600 dark:text-slate-300">
                <MapPin className="w-5 h-5 text-gray-400 dark:text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{data.textAddress}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{data.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
                <Phone className="w-5 h-5 text-gray-400 dark:text-slate-500 shrink-0" />
                <span className="font-medium text-gray-900 dark:text-white">{data.contactPhone}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Operating Hours</h3>
            <div className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
              <Clock className="w-5 h-5 text-gray-400 dark:text-slate-500 shrink-0" />
              <span className="font-medium text-gray-900 dark:text-white">
                {data.is24Hours ? 'Open 24 Hours' : `${data.openTime?.slice(0, 5) || ''} - ${data.closeTime?.slice(0, 5) || ''}`}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">License Document</h3>
          <div className="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden bg-gray-50 dark:bg-slate-950 h-48 flex items-center justify-center">
            {data.licenseImageUrl ? (
              <img src={data.licenseImageUrl} alt="License" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center text-gray-400 dark:text-slate-500">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
