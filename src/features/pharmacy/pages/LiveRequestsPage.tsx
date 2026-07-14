import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Image, Trash2, Radio, Send, Sparkles } from 'lucide-react';
import { useLiveRequestsStore } from '../stores/useLiveRequestsStore';
import { useNavigate } from 'react-router-dom';
import { ImageModal } from '@/shared/ui/ImageModal';
import { TimeAgoText } from '@/shared/ui/TimeAgoText';
import { usePagination } from '@/shared/hooks/usePagination';
import { AppPagination } from '@/shared/ui/AppPagination';

export default function LiveRequestsPage() {
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
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Live Requests</h1>
            
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Live</span>
              </span>
  
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time prescription requests appearing instantly as they are submitted by patients in your area.</p>
        </div>
        <AnimatePresence>
          {!isEmpty && (
            <motion.button
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearLiveRequests}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/30 transition-colors shadow-sm w-fit"
            >
              <Trash2 className="w-4 h-4" />
              Clear Feed
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Empty State — Radar Mode */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center py-28 text-center rounded-3xl bg-gradient-to-b from-teal-50/60 dark:from-teal-950/20 to-transparent"
        >
          {/* Radar Animation */}
          <div className="relative w-32 h-32 mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-teal-300/40 dark:border-teal-700/40"
              animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-teal-400/50 dark:border-teal-600/50"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-teal-500/60 dark:border-teal-500/40"
              animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/30 border-2 border-teal-200 dark:border-teal-900/40 flex items-center justify-center">
                <Radio className="w-7 h-7 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>
 
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Radar active</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            Listening for live prescription requests in your area. New requests will appear here instantly.
          </p>
          <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 text-sm font-medium rounded-full border border-teal-200 dark:border-teal-800 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            Live Connection Active
          </div>
        </motion.div>
      )}

      {/* Live Feed Cards */}
      {!isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedRequests.map((req, i) => (
              <motion.article
                key={req.id}
                layout
                initial={{ opacity: 0, y: -40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, x: -24 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28, delay: i * 0.03 }}
                whileHover={{ y: -3 }}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-500/50 transition-all relative overflow-hidden"
              >
                {/* New glow pulse overlay */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ boxShadow: '0 0 24px 4px rgba(20, 184, 166, 0.35)' }}
                  animate={{ boxShadow: '0 0 0px 0px rgba(20, 184, 166, 0)' }}
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
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </motion.span>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/30">
                      New #{req.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
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
                      className="w-full h-40 rounded-xl overflow-hidden border border-slate-105 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center cursor-pointer relative"
                    >
                      <img
                        src={req.imageUrl}
                        alt="Prescription"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col items-center justify-center text-slate-400 dark:text-slate-550">
                      <Image className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">No image provided</span>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white pt-1 flex items-center gap-1.5">
                    {req.medicineName || (
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-teal-500" />
                        Prescription Image Attached
                      </span>
                    )}
                  </h3>

                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    {req.deliveryArea || 'Nearby Area'}
                  </div>

                  {/* Notes Display */}
                  {req.patientNotes && (
                    <div className="bg-teal-50/60 dark:bg-teal-950/20 p-3 rounded-xl border border-teal-100 dark:border-teal-900/30">
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                        <span className="font-semibold block mb-1 text-xs text-teal-800 dark:text-teal-400">Patient notes</span>
                        {req.patientNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom: expiry + action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/30">
                    ⏳ {formatExpiry(req.expiresAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeRequest(req.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      aria-label="Dismiss"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/pharmacy/requests/${req.id}/bid`, { state: { requestData: req } })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Bid
                    </motion.button>
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