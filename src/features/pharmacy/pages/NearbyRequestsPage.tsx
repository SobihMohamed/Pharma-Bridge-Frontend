import React, { useState } from 'react';
import { MapPin, Clock, Search, Filter, AlertCircle, Pill } from 'lucide-react';
import { useNearbyRequestsQuery } from '../hooks/useNearbyRequests';
import { useNavigate } from 'react-router-dom';
import { ImageModal } from '@/shared/ui/ImageModal';
import { TimeAgoText } from '@/shared/ui/TimeAgoText';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';

export default function NearbyRequestsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { pageIndex, setPageIndex, pageSize } = usePagination();

  // Fetch REST API data
  const { data: paginatedData, isLoading, isError } = useNearbyRequestsQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });



  const getInitials = (name?: string | null) => {
    if (!name) return 'PT';
    return name.slice(0, 2).toUpperCase();
  };

  const requests = paginatedData?.data || [];
  const totalCount = paginatedData?.totalCount || 0;
  
  const filteredRequests = requests.filter(req => 
    !searchTerm || 
    (req.medicineName && req.medicineName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (req.patientNotes && req.patientNotes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-8 px-4 md:px-8 pb-12 max-w-7xl mx-auto">
      {/* Page Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Nearby Requests</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Active patient prescriptions seeking fulfillment within your radius.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm w-full sm:w-64 shadow-sm" 
              placeholder="Search medications..." 
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 dark:border-teal-400"></div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Failed to load requests</h3>
          <p className="text-gray-500 dark:text-slate-400">Please try refreshing the page.</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
          <Pill className="w-12 h-12 text-gray-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No requests found</h3>
          <p className="text-gray-500 dark:text-slate-400">There are currently no matching prescription requests in your area.</p>
        </div>
      ) : (
        /* Requests Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <article key={req.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 flex flex-col gap-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold border border-teal-100 dark:border-teal-900/30">
                    {getInitials(req.deliveryArea)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                      {req.deliveryArea || 'Nearby Area'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Submitted <TimeAgoText date={req.createdAt} />
                    </div>
                  </div>
                </div>
                {req.status === 'Pending' && (
                  <span className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-200 dark:border-blue-900/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 block"></span>
                    New
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {req.medicineName || 'Prescription Image Upload'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-350 mb-3 line-clamp-2">
                  {req.patientNotes || 'No additional notes provided by the patient.'}
                </p>
                {req.imageUrl && (
                  <div 
                    onClick={() => setZoomedImage(req.imageUrl)}
                    className="mt-2 mb-3 h-24 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={req.imageUrl} 
                      alt="Prescription" 
                      className="max-h-full max-w-full object-cover" 
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                <button 
                  onClick={() => navigate(`/pharmacy/requests/${req.id}/bid`, { state: { requestData: req } })}
                  className="w-full bg-teal-600 dark:bg-teal-500 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm"
                >
                  View & Submit Bid
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalCount > pageSize && (
         <AppPagination 
           totalCount={totalCount} 
           currentPage={pageIndex} 
           pageSize={pageSize} 
           onPageChange={setPageIndex} 
         />
      )}

      {/* Full-screen Image Modal Overlay */}
      <ImageModal 
        imageUrl={zoomedImage} 
        onClose={() => setZoomedImage(null)} 
      />
    </div>
  );
}
