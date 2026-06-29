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

  const getStatusBadge = () => {
    const status = data.status || (data.isApproved ? 'Approved' : 'Pending');
    
    if (status === 'Active' || status === 'Approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          {status}
        </span>
      );
    }
    
    if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
          <XCircle className="w-4 h-4" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-4 h-4" />
        Pending Review
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg text-teal-700">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{data.pharmacyName}</h2>
            <p className="text-sm text-gray-500">License: {data.licenseNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge()}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Info
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Contact & Location</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{data.textAddress}</p>
                  <p className="text-sm">{data.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-900">{data.contactPhone}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Operating Hours</h3>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 text-gray-400 shrink-0" />
              <span className="font-medium text-gray-900">
                {data.is24Hours ? 'Open 24 Hours' : `${data.openTime?.slice(0, 5) || ''} - ${data.closeTime?.slice(0, 5) || ''}`}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">License Document</h3>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
            {data.licenseImageUrl ? (
              <img src={data.licenseImageUrl} alt="License" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
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
