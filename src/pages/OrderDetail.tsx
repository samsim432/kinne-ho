import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import type { SellerDeliveryMethod, EscrowStatus } from '../types/escrow';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  UserCheck, 
  Clock, 
  ArrowRight,
  Upload,
  X
} from 'lucide-react';

export const OrderDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = searchParams.get('productId') || '1';
  const fulfillmentType = (searchParams.get('fulfillment') as 'pickup' | 'delivery') || 'pickup';
  const deliveryFee = parseInt(searchParams.get('fee') || '0', 10);

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  // Escrow & State
  const [orderStatus, setOrderStatus] = useState<EscrowStatus>(
    fulfillmentType === 'pickup' ? 'awaiting_handover' : 'escrow_locked'
  );

  const [handshakePin] = useState('749201'); // 6-Digit Security Handshake PIN
  const [sellerInputPin, setSellerInputPin] = useState('');
  const [sellerMethod, setSellerMethod] = useState<SellerDeliveryMethod>('seller_p2p');
  const [courierWaybill, setCourierWaybill] = useState('');
  
  // Dispute state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  // Seller submits Handshake OTP to verify physical delivery
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (sellerInputPin === handshakePin) {
      setOrderStatus('delivered_pending_review');
      alert('Handshake Verified! Item marked as Handed Over. 48-Hour Inspection window started.');
    } else {
      alert('Invalid PIN. Please ask the buyer for their 6-digit Handshake PIN.');
    }
  };

  // Seller selects delivery method
  const handleConfirmSellerDelivery = () => {
    setOrderStatus('in_transit');
  };

  // Buyer confirms everything is OK -> Release Escrow to Seller
  const handleBuyerReleaseFunds = () => {
    setOrderStatus('completed_released');
  };

  // Buyer submits dispute
  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSubmitted(true);
    setOrderStatus('disputed');
    setTimeout(() => {
      setShowDisputeModal(false);
    }, 1500);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-3">
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
            <span>Escrow Protected: Rs. {(product.price + deliveryFee).toLocaleString()}</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          {product.title}
        </h1>
      </div>

      {/* Dynamic State Machine Panels */}
      
      {/* 1. PICKUP FLOW: Buyer Handshake PIN & Seller PIN Validation */}
      {fulfillmentType === 'pickup' && orderStatus !== 'completed_released' && orderStatus !== 'disputed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Buyer View: Show PIN */}
          <div className="bg-white border-2 border-[#1b7a53] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#1b7a53]">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-sm font-bold">Buyer’s Handshake PIN</h3>
            </div>
            <p className="text-xs text-gray-500">
              Meet {product.sellerName} at {product.location}. Inspect the item. When satisfied, give this PIN to the seller:
            </p>
            <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-xl p-4 text-center">
              <span className="text-3xl font-extrabold tracking-widest text-[#1b7a53]">
                {handshakePin}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              🔒 Do NOT give this PIN over chat. Only reveal when you have the item in your hands.
            </p>
          </div>

          {/* Seller View: Enter PIN */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-gray-900">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold">Seller: Confirm In-Person Handover</h3>
            </div>
            <p className="text-xs text-gray-500">
              Ask the buyer for their 6-digit Handshake PIN after handing over the {product.title}:
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

      {/* 2. DELIVERY FLOW: Seller Chooses Self P2P vs Partner Courier */}
      {fulfillmentType === 'delivery' && orderStatus === 'escrow_locked' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Seller Action: Choose How You Will Deliver
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Buyer has paid the delivery fee of Rs. {deliveryFee} into Escrow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Option 1: Self P2P Delivery */}
            <div
              onClick={() => setSellerMethod('seller_p2p')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                sellerMethod === 'seller_p2p'
                  ? 'border-[#1b7a53] bg-[#1b7a53]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-900">I will deliver myself (P2P)</span>
                <span className="text-xs font-extrabold text-[#1b7a53] bg-emerald-50 px-2 py-0.5 rounded">
                  You earn +Rs. {deliveryFee}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                You deliver the item yourself. You receive 100% of the item price + the full delivery charge.
              </p>
            </div>

            {/* Option 2: Partner Courier */}
            <div
              onClick={() => setSellerMethod('partner_courier')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                sellerMethod === 'partner_courier'
                  ? 'border-[#1b7a53] bg-[#1b7a53]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-900">Use Partner Courier</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Courier takes Rs. {deliveryFee}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Ship via Pathao / Nepal Can Move. Delivery charge goes directly to the courier company.
              </p>
            </div>

          </div>

          {sellerMethod === 'partner_courier' && (
            <div className="space-y-1 pt-1">
              <label className="text-xs font-bold text-gray-700 block">Courier Waybill / Tracking No.</label>
              <input
                type="text"
                placeholder="e.g. NCM-948201 or Pathao Parcel ID"
                value={courierWaybill}
                onChange={(e) => setCourierWaybill(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          )}

          <button
            onClick={handleConfirmSellerDelivery}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
          >
            Confirm & Mark In Transit
          </button>
        </div>
      )}

      {/* 3. 48-Hour Inspection Period & Release / Dispute Panel */}
      {(orderStatus === 'in_transit' || orderStatus === 'delivered_pending_review') && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">48-Hour Inspection Window Active</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Inspect your {product.title}. Ensure all features and condition match the listing.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl font-bold border border-amber-200">
              <Clock className="w-4 h-4" />
              <span>47h 38m remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* Release funds */}
            <button
              onClick={handleBuyerReleaseFunds}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I Received Item & Everything is OK</span>
            </button>

            {/* Raise dispute */}
            <button
              onClick={() => setShowDisputeModal(true)}
              className="bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>I Have an Issue (Report Defect)</span>
            </button>

          </div>
        </div>
      )}

      {/* 4. Order Completed State */}
      {orderStatus === 'completed_released' && (
        <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-8 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#1b7a53] text-white flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Deal Completed & Funds Released!</h2>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Payment has been transferred to {product.sellerName}'s Kinne Ho? Wallet. Thank you for giving this item another life!
          </p>
          <button
            onClick={() => navigate('/wallet')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-semibold px-5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            View Wallet History
          </button>
        </div>
      )}

      {/* 5. Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowDisputeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {disputeSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-red-500 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">Escrow Frozen & Dispute Filed</h3>
                <p className="text-xs text-gray-500">
                  Our moderation team is reviewing your report. The seller cannot withdraw funds until resolved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">Report an Issue with this Item</h3>
                  <p className="text-xs text-gray-500">
                    Escrow payout will be frozen immediately while we review your photos.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Describe the defect or problem</label>
                  <textarea
                    rows={3}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="e.g. Screen has deep crack not mentioned in description or wrong model delivered..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center space-y-1 cursor-pointer hover:border-red-500 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mx-auto" />
                  <span className="text-xs font-semibold text-gray-700 block">Upload Evidence Photos (1-3)</span>
                  <span className="text-[10px] text-gray-400">Show defects clearly</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Freeze Escrow & Submit Dispute
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};