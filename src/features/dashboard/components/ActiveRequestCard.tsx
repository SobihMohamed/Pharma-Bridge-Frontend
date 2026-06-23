import { FileText, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActiveRequestCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2 text-teal-700">
          <FileText className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Current Active Request</h2>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
          Pending Bids
        </span>
      </div>
      
      <div className="p-5 flex-grow flex flex-col justify-center">
        <div className="mb-1 text-sm text-gray-500 font-mono">REQ-8493</div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Amoxicillin 500mg Capsule</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-sm font-medium">Waiting for offers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Expiration Date: Oct 21, 2023</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100 mt-auto">
        <Link 
          to="/requests/REQ-8493" 
          className="flex items-center justify-center gap-1 text-teal-600 font-medium hover:text-teal-700 transition-colors w-full"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
