import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, MapPin, Store, FileText, Image as ImageIcon } from 'lucide-react';
import { PrescriptionRequestDto } from '../types';

interface RequestCardProps {
  request: PrescriptionRequestDto;
}

export default function RequestCard({ request }: RequestCardProps) {
  // Mapping status to colors based on the design
  const statusConfig: Record<string, { bg: string, text: string, iconBg: string, iconColor: string }> = {
    Pending: { 
      bg: 'bg-[#FFDCBC]', 
      text: 'text-[#402300]',
      iconBg: 'bg-[#C8E6FF]',
      iconColor: 'text-[#009ADA]'
    },
    HasBids: { 
      bg: 'bg-[#C8E6FF]', 
      text: 'text-[#004C6E]',
      iconBg: 'bg-[#85CBFD]/20',
      iconColor: 'text-[#006591]'
    },
    Closed: { 
      bg: 'bg-gray-200', 
      text: 'text-gray-700',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
    Cancelled: { 
      bg: 'bg-red-100', 
      text: 'text-red-800',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600'
    },
  };

  const config = statusConfig[request.status] || statusConfig.Pending;
  const hasBids = request.bidsCount > 0;
  const bidsCount = request.bidsCount;

  return (
    <article className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
            {request.imageUrl ? (
              <ImageIcon className="w-6 h-6" />
            ) : (
              <FileText className="w-6 h-6" />
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
            {request.status}
          </span>
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 line-clamp-1">
          {request.medicineName || "Prescription Image Attached"}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-3">
          <Calendar className="w-4 h-4" />
          {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-4">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{request.deliveryArea}</span>
        </div>
        
        <p className="text-gray-600 text-sm italic border-l-2 border-gray-200 pl-4 py-1 line-clamp-2">
          {request.patientNotes || 'No additional notes provided.'}
        </p>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center mt-auto">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
          hasBids 
            ? 'bg-[#009ADA]/10 border-[#009ADA]/20 text-[#009ADA]' 
            : 'bg-white/50 border-gray-200/50 text-gray-500'
        }`}>
          <Store className={`w-4 h-4 ${hasBids ? 'text-[#009ADA]' : 'text-gray-400'}`} />
          <span className={`text-sm font-bold ${hasBids ? 'text-[#009ADA]' : 'text-gray-600'}`}>
            {bidsCount} {bidsCount === 1 ? 'Offer' : 'Offers'}
          </span>
        </div>

        <Link 
          to={`/requests/${request.id}`}
          className="flex items-center gap-1 text-[#009ADA] font-bold text-sm group-hover:gap-2 transition-all"
        >
          View Details
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    </article>
  );
}
