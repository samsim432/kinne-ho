import React, { useState } from 'react';
import { X, Tag, ShieldAlert, Check } from 'lucide-react';
import type { ProductItem } from '../../types/marketplace';

interface MakeOfferModalProps {
  product: ProductItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOffer: (amount: number) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitOffer,
}) => {
  const [offerAmount, setOfferAmount] = useState<number>(Math.round(product.price * 0.9));
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleQuickPercent = (discountRatio: number) => {
    setOfferAmount(Math.round(product.price * (1 - discountRatio)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitOffer(offerAmount);
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1b7a53]/10 text-[#1b7a53] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Offer Sent to {product.sellerName}!</h3>
            <p className="text-xs text-gray-500">
              Offered <strong>Rs. {offerAmount.toLocaleString()}</strong>. The seller will be notified.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#1b7a53]" />
                <h3 className="text-lg font-bold text-gray-900">Make an Offer</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Negotiate directly with {product.sellerName}.
              </p>
            </div>

            {/* Product Summary Pill */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-gray-900 truncate">{product.title}</h4>
                <p className="text-xs text-gray-500">Listed: Rs. {product.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">
                  Your Offer (Rs.)
                </label>
                <input
                  type="number"
                  min={1}
                  max={product.price}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full text-xl font-bold bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1b7a53]"
                  required
                />
              </div>

              {/* Quick Discount Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPercent(0.1)}
                  className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:border-[#1b7a53] text-gray-600 hover:text-[#1b7a53] font-medium transition-colors"
                >
                  -10% (Rs. {Math.round(product.price * 0.9).toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPercent(0.15)}
                  className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:border-[#1b7a53] text-gray-600 hover:text-[#1b7a53] font-medium transition-colors"
                >
                  -15% (Rs. {Math.round(product.price * 0.85).toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPercent(0.2)}
                  className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:border-[#1b7a53] text-gray-600 hover:text-[#1b7a53] font-medium transition-colors"
                >
                  -20% (Rs. {Math.round(product.price * 0.8).toLocaleString()})
                </button>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Making an offer is not a payment. You only pay once the seller accepts your offer.</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Send Offer · Rs. {offerAmount.toLocaleString()}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};