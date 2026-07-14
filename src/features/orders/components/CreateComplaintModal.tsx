import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CreateComplaintModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function CreateComplaintModal({ orderId, isOpen, onClose, onSubmitSuccess }: CreateComplaintModalProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    toast.success('Complaint submitted successfully. We will review it shortly.');
    onSubmitSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-[#0b0f19]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            File a Complaint
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-sm p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 font-medium mb-2">
            Filing a complaint for Order #{orderId.split('_')[1]}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
              Complaint Subject <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-teal-500 outline-none transition-shadow text-sm bg-white dark:bg-[#131b2e] dark:text-white"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="" disabled>Select an issue...</option>
              <option value="Wrong Items Delivered">Wrong Items Delivered</option>
              <option value="Missing Items">Missing Items</option>
              <option value="Damaged Items">Damaged Items</option>
              <option value="Late Delivery">Late Delivery</option>
              <option value="Pharmacy Behavior">Pharmacy Behavior</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
              Description <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-teal-500 outline-none transition-shadow text-sm dark:bg-[#131b2e] dark:text-white dark:placeholder-slate-500"
              rows={5}
              placeholder="Please provide details about your issue so we can help you better..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-200 bg-white dark:bg-[#131b2e] rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !subject || !description}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 flex justify-center items-center transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
