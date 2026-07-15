import { FileText, Clock, Building2, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { ComplaintDto } from '../types';
import { formatLocalDate } from '@/utils/formatTime';

interface ComplaintCardProps {
  complaint: ComplaintDto;
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  const statusConfig = {
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
    InProgress: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'In Progress' },
    Resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Resolved' },
  };

  const StatusIcon = statusConfig[complaint.status].icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                {complaint.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span className="font-medium text-gray-700">{complaint.orderReference}</span>
                <span>•</span>
                <span>{formatLocalDate(complaint.date)}</span>
              </div>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusConfig[complaint.status].color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig[complaint.status].label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="font-medium">Pharmacy: {complaint.pharmacyName}</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          "{complaint.description}"
        </p>

        {complaint.adminReply && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
              Support Team Reply
            </h4>
            <div className={`p-4 rounded-lg text-sm border ${
              complaint.status === 'Resolved' 
                ? 'bg-green-50 text-green-900 border-green-100' 
                : 'bg-blue-50 text-blue-900 border-blue-100'
            }`}>
              {complaint.adminReply}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
