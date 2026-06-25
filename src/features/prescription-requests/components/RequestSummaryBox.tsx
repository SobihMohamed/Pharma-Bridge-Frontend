import React, { useState } from 'react';
import { FileText, Calendar, MapPin, ImageIcon, X } from 'lucide-react';
import { PrescriptionRequestDetailsDto } from '../types';

interface RequestSummaryBoxProps {
  request: PrescriptionRequestDetailsDto;
}

export default function RequestSummaryBox({ request }: RequestSummaryBoxProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    HasBids: 'bg-blue-100 text-blue-800 border-blue-200',
    Closed: 'bg-green-100 text-green-800 border-green-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Request Details
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[request.status]}`}>
            {request.status}
          </span>
        </div>

        <div className="p-5 space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Requested on {new Date(request.createdAt).toLocaleDateString()}</span>
          </div>

          {request.imageUrl && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-600" />
                Attached Prescription
              </h3>
              <div 
                className="relative h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group border border-gray-200"
                onClick={() => setIsPreviewOpen(true)}
              >
                <img 
                  src={request.imageUrl} 
                  alt="Prescription" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            </div>
          )}

          {request.patientNotes && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Patient Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 italic border border-gray-100">
                "{request.patientNotes}"
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              Delivery Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-100">
              <p className="font-medium text-gray-900 mb-1">{request.deliveryArea}</p>
              <p>Will be delivered to this requested location upon acceptance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Lightbox */}
      {isPreviewOpen && request.imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(false); }}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={request.imageUrl} 
              alt="Prescription Enlarged" 
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
