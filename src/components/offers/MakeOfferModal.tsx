import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { ProductItem } from '../../types/marketplace';

interface MakeOfferModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOffer: (amount: number, message?: string) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitOffer,
}) => {
  const [offerAmount, setOfferAmount] = useState<number>(43000);
  const [message, setMessage] = useState('Hi! Can we meet in Kathmandu this weekend?');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOffer(offerAmount, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900">Make an offer</h3>
          <p className="text-sm text-gray-500">
            {product.title} — listed at Rs. {product.price.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Offer Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 block">Your offer</label>
            <div className="relative flex items-center border border-gray-300 rounded-xl px-3.5 py-2.5 focus-within:border-[#1b7a53] focus-within:ring-1 focus-within:ring-[#1b7a53] bg-white">
              <span className="text-gray-500 font-medium text-sm mr-1">Rs.</span>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(Number(e.target.value))}
                className="w-full text-base font-semibold text-gray-900 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Asking Price vs Offer Breakdown Box */}
          <div className="bg-gray-50/80 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between items-center text-gray-600">
              <span>Asking price</span>
              <span className="font-semibold text-gray-900">Rs. {product.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Your offer</span>
              <span className="font-bold text-[#1b7a53]">Rs. {offerAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Optional Message */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 block">Add a message (optional)</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Suggest a meetup location or ask a quick question..."
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1b7a53] focus:ring-1 focus:ring-[#1b7a53]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm"
          >
            Send offer
          </button>
        </form>
      </div>
    </div>
  );
};