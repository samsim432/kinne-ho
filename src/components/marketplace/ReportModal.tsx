import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import type { ProductItem } from '../../types/marketplace';

interface ReportModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Suspicious / Potential Scammer',
  'Counterfeit or Replica Goods',
  'Incorrect Category or Specifications',
  'Item already sold elsewhere',
  'Offensive language or images',
];

export const ReportModal: React.FC<ReportModalProps> = ({ product, isOpen, onClose }) => {
  const { showToast } = useMarketplace();
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Report Submitted 🛡️', 'Our moderation team will review this listing within 2 hours.', 'info');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <Flag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Report this Listing</h3>
          <p className="text-xs text-gray-500">
            Reporting: <strong className="text-gray-900">{product.title}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 block">Reason for Report</label>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <div
                  key={r}
                  onClick={() => setSelectedReason(r)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    selectedReason === r
                      ? 'border-red-500 bg-red-50/50 text-red-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Additional Details (Optional)</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any additional context for our trust & safety team..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};