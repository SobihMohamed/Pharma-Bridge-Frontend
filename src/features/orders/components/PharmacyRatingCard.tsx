import React, { useState } from 'react';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitPharmacyRatingMutation } from '../api/orders';

interface PharmacyRatingCardProps {
  orderId: number;
  pharmacyId: number;
}

export function PharmacyRatingCard({ orderId, pharmacyId }: PharmacyRatingCardProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitRating, isPending } = useSubmitPharmacyRatingMutation();

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a star rating before submitting.');
      return;
    }

    submitRating(
      { ratingValue: rating, comment, orderId, pharmacyId },
      {
        onSuccess: (data) => {
          const successMsg = (data as any)?.message || (data as any)?.data || 'Rating submitted successfully!';
          toast.success(String(successMsg));
          setSubmitted(true);
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message || error?.message || 'Failed to submit rating.';
          toast.error(errMsg);
          
          if (error?.response?.status === 400 && errMsg.toLowerCase().includes('already rated')) {
            setSubmitted(true);
          }
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="bg-[#f0f9f2] dark:bg-emerald-900/20 rounded-2xl p-6 border border-[#c1e2c8] dark:border-emerald-800/50 text-center transition-colors duration-300">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-1">Thank You!</h3>
        <p className="text-sm text-emerald-700/80 dark:text-emerald-500/80 font-medium">Your feedback has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#bec8d1] dark:border-slate-800 shadow-lg shadow-[#eceef0]/50 dark:shadow-black/20 transition-colors duration-300">
      <h3 className="text-lg font-bold text-[#191c1e] dark:text-white mb-2">Rate Your Experience</h3>
      <p className="text-sm text-[#3e4850] dark:text-slate-400 mb-5">How was your order from this pharmacy?</p>

      {/* Stars */}
      <div className="flex items-center gap-2 mb-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-[#e0e3e5] dark:text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        className="w-full rounded-xl bg-[#f7f9fb] dark:bg-[#0b0f19] border border-[#bec8d1] dark:border-slate-700 p-4 text-sm text-[#191c1e] dark:text-white placeholder-[#6e7881] dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006590]/20 focus:border-[#006590] dark:focus:ring-[#009ada]/20 dark:focus:border-[#009ada] resize-none mb-5 transition-colors"
        rows={3}
        placeholder="Add a comment (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isPending}
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isPending || rating === 0}
        className="w-full h-12 flex items-center justify-center rounded-xl font-bold text-white bg-[#006590] hover:bg-[#00567c] dark:bg-[#009ada] dark:hover:bg-[#0086c2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Submit Rating'
        )}
      </button>
    </div>
  );
}
