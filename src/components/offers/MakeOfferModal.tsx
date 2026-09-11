import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Tag, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
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
  const navigate = useNavigate();
  const { showToast } = useMarketplace();
  const [offerPrice, setOfferPrice] = useState<string>(
    Math.round(product.price * 0.9).toString()
  );

  if (!isOpen) return null;

  const quickDiscounts = [
    { label: '-5%', val: Math.round(product.price * 0.95) },
    { label: '-10%', val: Math.round(product.price * 0.9) },
    { label: '-15%', val: Math.round(product.price * 0.85) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(offerPrice, 10);
    if (!amount || amount <= 0) {
      showToast('Invalid Amount', 'Please enter a valid offer amount.', 'warning');
      return;
    }
    if (amount < product.price * 0.5) {
      showToast('Offer too low', 'Offers below 50% of the asking price are usually rejected.', 'warning');
      return;
    }

    onSubmitOffer(amount);
    showToast('Offer Proposed! 🤝', `Your offer of Rs. ${amount.toLocaleString()} was sent to ${product.sellerName}.`, 'success');
    onClose();
    navigate(`/messages?seller=${encodeURIComponent(product.sellerName)}&productId=${product.id}&offer=${amount}`);
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
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Make an Offer</h3>
          <p className="text-xs text-gray-500">
            Current asking price: <strong className="text-gray-900">Rs. {product.price.toLocaleString()}</strong>
          </p>
        </div>

        {/* Quick Discount Buttons */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Quick Offers</label>
          <div className="grid grid-cols-3 gap-2">
            {quickDiscounts.map((qd) => (
              <button
                key={qd.label}
                type="button"
                onClick={() => setOfferPrice(qd.val.toString())}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  offerPrice === qd.val.toString()
                    ? 'border-[#1b7a53] bg-emerald-50 text-[#1b7a53]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{qd.label}</span>
                <span className="block text-[10px] text-gray-400">Rs. {qd.val.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Your Offer Amount (Rs.)</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-bold text-gray-500">Rs.</span>
              <input
                type="number"
                required
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-base font-extrabold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-3.5 text-xs text-gray-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1b7a53] shrink-0 mt-0.5" />
            <span>If accepted, you can instantly lock this price into Escrow with zero risk.</span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
          >
            <span>Send Offer to Seller</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};