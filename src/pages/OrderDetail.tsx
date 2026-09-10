import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { ReviewModal } from '../components/reviews/ReviewModal';
import type { SellerDeliveryMethod, EscrowStatus } from '../types/escrow';
import { 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  UserCheck, 
  Clock, 
  Upload, 
  X,
  Truck,
  Star
} from 'lucide-react';

const TRACKING_STEPS = [
  { id: 'escrow_locked', label: 'Escrow Locked', icon: ShieldCheck },
  { id: 'in_transit', label: 'Dispatched / Meetup', icon: Truck },
  { id: 'delivered_pending_review', label: '48h Inspection', icon: Clock },
  { id: 'completed_released', label: 'Funds Released', icon: CheckCircle2 },
];

export const OrderDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { releaseEscrowToSeller } = useMarketplace();
  const { t } = useLanguage();

  const productId = searchParams.get('productId') || '1';
  const fulfillmentType = (searchParams.get('fulfillment') as 'pickup' | 'delivery') || 'pickup';
  const deliveryFee = parseInt(searchParams.get('fee') || '0', 10);

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  const [orderStatus, setOrderStatus] = useState<EscrowStatus>(
    fulfillmentType === 'pickup' ? 'awaiting_handover' : 'escrow_locked'
  );

  const [handshakePin] = useState('749201');
  const [sellerInputPin, setSellerInputPin] = useState('');
  const [sellerMethod, setSellerMethod] = useState<SellerDeliveryMethod>('seller_p2p');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const getActiveStepIndex = () => {
    if (orderStatus === 'escrow_locked' || orderStatus === 'awaiting_handover') return 0;
    if (orderStatus === 'in_transit') return 1;
    if (orderStatus === 'delivered_pending_review') return 2;
    if (orderStatus === 'completed_released') return 3;
    return 2;
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (sellerInputPin === handshakePin) {
      setOrderStatus('delivered_pending_review');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } else {
      alert('Invalid Handshake PIN. Please ask the buyer to check their screen.');
    }
  };

  const handleBuyerReleaseFunds = () => {
    releaseEscrowToSeller(product.price + deliveryFee);
    setOrderStatus('completed_released');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      setShowReviewModal(true);
    }, 1000);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Order #KH-{productId}902
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              orderStatus === 'completed_released' ? 'bg-emerald-100 text-[#1b7a53]' :
              orderStatus === 'disputed' ? 'bg-red-100 text-red-600' :
              orderStatus === 'in_transit' ? 'bg-blue-100 text-blue-700' :
              'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {orderStatus.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#1b7a53] font-bold bg-[#1b7a53]/10 px-3 py-1 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.escrowProtected}: Rs. {(product.price + deliveryFee).toLocaleString()}</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          {product.title}
        </h1>

        {/* Visual Stepper */}
        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-4 gap-2 relative">
            {TRACKING_STEPS.map((stepItem, idx) => {
              const Icon = stepItem.icon;
              const isActive = idx <= getActiveStepIndex();
              const isCurrent = idx === getActiveStepIndex();

              return (
                <div key={stepItem.id} className="flex flex-col items-center text-center space-y-1.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'bg-[#1b7a53] text-white shadow-xs' : 'bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-2 ring-[#1b7a53] ring-offset-2' : ''}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {stepItem.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pickup Handshake View */}
      {fulfillmentType === 'pickup' && orderStatus !== 'completed_released' && orderStatus !== 'disputed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border-2 border-[#1b7a53] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between text-[#1b7a53]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                <h3 className="text-sm font-bold">Buyer’s Handshake PIN</h3>
              </div>
              <QrCode className="w-5 h-5" />
            </div>

            <p className="text-xs text-gray-500">
              Meet {product.sellerName} at {product.location}. Test the item. When satisfied, give this PIN to the seller:
            </p>

            <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-xl p-5 text-center space-y-1">
              <span className="text-3xl font-extrabold tracking-widest text-[#1b7a53]">
                {handshakePin}
              </span>
              <p className="text-[10px] text-gray-400">One-time security token</p>
            </div>

            <p className="text-[11px] text-gray-400 text-center">
              🔒 Only reveal when physical inspection is complete.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-gray-900">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold">Seller: Confirm In-Person Handover</h3>
            </div>
            <p className="text-xs text-gray-500">
              Enter the buyer's 6-digit PIN to verify handover:
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <input
                type="text"
                placeholder="Enter 6-digit PIN"
                maxLength={6}
                value={sellerInputPin}
                onChange={(e) => setSellerInputPin(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-center text-lg font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
              >
                Validate PIN & Complete Handover
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delivery Mode View */}
      {fulfillmentType === 'delivery' && orderStatus === 'escrow_locked' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="text-base font-bold text-gray-900">Seller Action: Choose How You Will Deliver</h3>
            <p className="text-xs text-gray-500 mt-0.5">Buyer has deposited delivery fee of Rs. {deliveryFee} into Escrow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSellerMethod('seller_p2p')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                sellerMethod === 'seller_p2p' ? 'border-[#1b7a53] bg-[#1b7a53]/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-900">I will deliver myself (P2P)</span>
                <span className="text-xs font-extrabold text-[#1b7a53] bg-emerald-50 px-2 py-0.5 rounded">
                  You earn +Rs. {deliveryFee}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">You receive 100% of the item price + delivery charge upon handover.</p>
            </div>

            <div
              onClick={() => setSellerMethod('partner_courier')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                sellerMethod === 'partner_courier' ? 'border-[#1b7a53] bg-[#1b7a53]/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-900">Use Partner Courier</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Courier takes Rs. {deliveryFee}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Ship via Pathao / Nepal Can Move.</p>
            </div>
          </div>

          <button
            onClick={() => setOrderStatus('in_transit')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
          >
            Confirm & Mark In Transit
          </button>
        </div>
      )}

      {/* 48-Hour Inspection Period */}
      {(orderStatus === 'in_transit' || orderStatus === 'delivered_pending_review') && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">{t.inspectItemNotice}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Inspect your {product.title}. Ensure condition matches the description.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl font-bold border border-amber-200">
              <Clock className="w-4 h-4" />
              <span>47h 38m remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleBuyerReleaseFunds}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.itemReceivedOk}</span>
            </button>

            <button
              onClick={() => setShowDisputeModal(true)}
              className="bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t.reportIssue}</span>
            </button>
          </div>
        </div>
      )}

      {/* Completed State */}
      {orderStatus === 'completed_released' && (
        <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-8 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#1b7a53] text-white flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Deal Completed & Funds Released!</h2>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Payment has been transferred to {product.sellerName}'s Kinne Ho? Wallet.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-white border border-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Rate Seller</span>
            </button>
            <button
              onClick={() => navigate('/wallet')}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              View Wallet History
            </button>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button onClick={() => setShowDisputeModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={(e) => { e.preventDefault(); setOrderStatus('disputed'); setShowDisputeModal(false); }} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Report an Issue with this Item</h3>
                <p className="text-xs text-gray-500">Escrow payout will be frozen immediately.</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Describe the defect</label>
                <textarea
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="e.g. Deep scratch not disclosed or battery failing..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-xs">
                Freeze Escrow & Submit Dispute
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        product={product}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
      />

    </div>
  );
};