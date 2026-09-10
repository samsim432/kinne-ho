import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Star, X, CheckCircle2, Sparkles } from 'lucide-react';
import type { ProductItem } from '../../types/marketplace';

interface ReviewModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (review: { rating: number; comment: string; tags: string[] }) => void;
}

const POSITIVE_TAGS = [
  'Fast Handover',
  'Accurate Condition',
  'Friendly & Polite',
  'Original Packaging Included',
  'Great Negotiator',
  'Clean Item',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ product, isOpen, onClose, onReviewSubmitted }) => {
  const { showToast } = useMarketplace();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Fast Handover', 'Accurate Condition']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Review published! ⭐', `Your review was added to ${product.sellerName}'s profile.`, 'success');
      if (onReviewSubmitted) {
        onReviewSubmitted({ rating, comment, tags: selectedTags });
      }
      onClose();
    }, 800);
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

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Rate Your Experience</h3>
          <p className="text-xs text-gray-500">How was your transaction with <strong>{product.sellerName}</strong>?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Selector */}
          <div className="flex justify-center items-center gap-1.5 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 cursor-pointer transition-transform hover:scale-115 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Compliment Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Select Highlights</label>
            <div className="flex flex-wrap gap-1.5">
              {POSITIVE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1b7a53] bg-[#1b7a53]/10 text-[#1b7a53]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Write a Review (Optional)</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Samir arrived on time at New Road, the iPhone was in exact condition as described..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing...' : 'Submit Seller Review'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};