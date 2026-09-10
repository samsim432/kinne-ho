import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Flag, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ProductItem } from '../../types/marketplace';

interface ReportModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Suspected Counterfeit / Fake Item',
  'Misleading Description / Condition',
  'Suspected Scam or Fraudulent Seller',
  'Prohibited Item on Kinne Ho?',
  'Offensive Content or Images',
  'Incorrect Category / Spam Listing',
];

export const ReportModal: React.FC<ReportModalProps> = ({ product, isOpen, onClose }) => {
  const { showToast } = useMarketplace();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Report submitted', 'Our moderation team will review this listing within 2 hours.', 'info');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-red-600">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Report Listing</h3>
            <p className="text-xs text-gray-500">Help keep Kinne Ho? safe and trustworthy.</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#1b7a53] mx-auto" />
            <h4 className="text-sm font-bold text-gray-900">Thank You For Your Report</h4>
            <p className="text-xs text-gray-500">We take violation reports very seriously.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
              <img src={product.image} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{product.title}</p>
                <p className="text-[11px] text-gray-500">Seller: {product.sellerName}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Why are you reporting this?</label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? 'border-red-500 bg-red-50/40 text-red-900 font-semibold'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-red-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Additional Details (Optional)</label>
              <textarea
                rows={2}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Add any specific context or links..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};