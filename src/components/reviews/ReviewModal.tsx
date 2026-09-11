import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

interface ReviewModalProps {
  sellerName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ sellerName, isOpen, onClose }) => {
  const { showToast } = useMarketplace();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Review Published! ⭐', `Your ${rating}-star feedback was added for ${sellerName}.`, 'success');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">Rate Your Experience</h3>
          <p className="text-xs text-gray-500">
            How was your transaction and handover with <strong className="text-gray-900">{sellerName}</strong>?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Selector */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Write Feedback (Optional)</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was the item condition accurate? Did the seller arrive on time for Handshake verification?"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};