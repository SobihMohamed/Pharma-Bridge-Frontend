import { Link } from 'react-router-dom';
import { FileText, Calendar, ChevronRight, ImageIcon, Store } from 'lucide-react';
import { PrescriptionRequestDto } from '../types';

interface RequestCardProps {
  request: PrescriptionRequestDto;
}

export default function RequestCard({ request }: RequestCardProps) {
  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    HasBids: 'bg-blue-100 text-blue-800',
    Closed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  const hasBids = request.bids && request.bids.length > 0;
  const pendingBidsCount = request.bids?.filter(b => b.status === 'Pending').length || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              {request.imageUrl ? (
                <ImageIcon className="w-5 h-5 text-teal-600" />
              ) : (
                <FileText className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Request #{request.id.toString().slice(-6).toUpperCase()}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[request.status]}`}>
            {request.status}
          </span>
        </div>

        <span className="text-xs text-gray-500">ID: {request.id.toString().slice(0, 8)}...</span>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
          {request.notes || 'No additional notes provided.'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {hasBids ? (
              <div className="flex items-center gap-1.5 text-sm font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                <Store className="w-4 h-4" />
                {pendingBidsCount} {pendingBidsCount === 1 ? 'Offer' : 'Offers'} Received
              </div>
            ) : (
              <div className="text-sm font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md">
                Awaiting Offers
              </div>
            )}
          </div>

          <Link 
            to={`/requests/${request.id}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            View Details
            <ChevronRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
