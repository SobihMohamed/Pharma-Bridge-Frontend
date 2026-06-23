import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { toast } from 'sonner';

interface RatePharmacyModalProps {
  orderId: string;
  pharmacyName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function RatePharmacyModal({ orderId, pharmacyName, isOpen, onClose, onSubmitSuccess }: RatePharmacyModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    toast.success('Thank you for your rating!');
    onSubmitSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Rate Your Experience</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">How was your order from</p>
            <p className="font-bold text-gray-900 text-lg">{pharmacyName}?</p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating) 
                      ? 'fill-current text-yellow-400' 
                      : 'text-gray-200'
                  } transition-colors`} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Write a review (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow text-sm"
              rows={4}
              placeholder="Tell us about the delivery speed, packaging, etc..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 flex justify-center items-center transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Submit Rating'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
