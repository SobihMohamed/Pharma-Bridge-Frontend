import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Image, Trash2, Radio, Send } from 'lucide-react';
import { useLiveRequestsStore } from '../stores/useLiveRequestsStore';
import { useSignalRNotifications } from '../hooks/useSignalRNotifications';
import { useNavigate } from 'react-router-dom';
import { ImageModal } from '@/shared/ui/ImageModal';
import { TimeAgoText } from '@/shared/ui/TimeAgoText';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';

export default function LiveRequestsPage() {
  // Activate the real-time listener
  useSignalRNotifications();

  const navigate = useNavigate();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { pageIndex, setPageIndex, pageSize } = usePagination();
  const liveRequests = useLiveRequestsStore((s) => s.liveRequests);
  const removeRequest = useLiveRequestsStore((s) => s.removeRequest);
  const clearLiveRequests = useLiveRequestsStore((s) => s.clearLiveRequests);

  const totalCount = liveRequests.length;
  const paginatedRequests = liveRequests.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const formatExpiry = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      if (diffMs <= 0) return 'Expired';
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins}m left`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h left`;
      return `${Math.floor(diffHrs / 24)}d left`;
    } catch {
      return 'N/A';
    }
  };

  const isEmpty = liveRequests.length === 0;

  return (
    <div className="pt-8 px-4 md:px-8 pb-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Live Requests</h1>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <p className="text-gray-500">Real-time prescription requests appearing as they arrive via SignalR.</p>
        </div>
        {!isEmpty && (
          <button
            onClick={clearLiveRequests}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear Feed
          </button>
        )}
      </div>

      {/* Empty State — Radar Mode */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-28 text-center"
        >
          {/* Radar Animation */}
          <div className="relative w-32 h-32 mb-8">
            {/* Outermost ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-teal-300/40"
              animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            />
            {/* Middle ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-teal-400/50"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
            {/* Inner ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-teal-500/60"
              animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1 }}
            />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center">
                <Radio className="w-7 h-7 text-teal-600" />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Radar Active</h3>
          <p className="text-gray-500 max-w-sm">
            Listening for live prescription requests in your area. New requests will appear here instantly.
          </p>
          <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 text-sm font-medium rounded-full border border-teal-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            SignalR Connected
          </div>
        </motion.div>
      )}

      {/* Live Feed Cards */}
      {!isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedRequests.map((req) => (
              <motion.article
                key={req.id}
                layout
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -30 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* New glow pulse overlay */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  initial={{ boxShadow: '0 0 20px 4px rgba(16, 185, 129, 0.35)' }}
                  animate={{ boxShadow: '0 0 0px 0px rgba(16, 185, 129, 0)' }}
                  transition={{ duration: 3, ease: 'easeOut' }}
                />

                {/* Top row: status dot + time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="relative flex h-2.5 w-2.5"
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      transition={{ repeat: 3, repeatType: 'mirror', duration: 0.5 }}
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </motion.span>
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      New #{req.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <TimeAgoText date={req.createdAt} />
                  </div>
                </div>

                {/* Middle: content */}
                <div className="flex-1 space-y-3">
                  {/* Image Display */}
                  {req.imageUrl ? (
                    <div 
                      onClick={() => setZoomedImage(req.imageUrl)}
                      className="w-full h-40 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center cursor-pointer group"
                    >
                      <img 
                        src={req.imageUrl} 
                        alt="Prescription" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-gray-400">
                       <Image className="w-8 h-8 mb-2 opacity-50" />
                       <span className="text-xs font-medium">No Image Provided</span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-900 pt-1">
                    {req.medicineName || 'Prescription Image Attached'}
                  </h3>

                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    {req.deliveryArea || 'Nearby Area'}
                  </div>

                  {/* Notes Display */}
                  {req.patientNotes && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        <span className="font-semibold block mb-1 text-xs text-blue-800">Patient Notes:</span>
                        {req.patientNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom: expiry + action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    ⏳ {formatExpiry(req.expiresAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeRequest(req.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Dismiss"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/pharmacy/requests/${req.id}/bid`)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Bid
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
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
