import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  Truck, 
  UserCheck, 
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, verifyHandshakePin, showToast } = useMarketplace();

  const [inputPin, setInputPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const order = getOrderById(orderId || 'KH-8941');

  if (!order) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <button
          onClick={() => navigate('/my-listings')}
          className="bg-[#1b7a53] text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Go to My Listings
        </button>
      </div>
    );
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      const success = verifyHandshakePin(order.id, inputPin);
      setIsVerifying(false);
      if (success) {
        setInputPin('');
      }
    }, 600);
  };

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <span className="text-xs font-bold text-gray-400">Order ID: {order.id}</span>
      </div>

      {/* Escrow Status Banner */}
      <div className={`p-6 rounded-3xl border shadow-card space-y-4 ${
        order.status === 'completed'
          ? 'bg-emerald-50/80 border-emerald-200'
          : 'bg-white border-gray-200/90'
      }`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#1b7a53]/10 text-[#1b7a53] px-2.5 py-0.5 rounded-full">
              {order.status === 'completed' ? 'Deal Completed & Paid' : 'Funds Safely Locked in Escrow'}
            </span>
            <h2 className="text-xl font-extrabold text-gray-900">
              {order.status === 'completed' ? 'Handover Confirmed 🎉' : 'Inspection Pending'}
            </h2>
            <p className="text-xs text-gray-500">
              {order.status === 'completed'
                ? 'The 4-digit Handshake OTP was verified. Funds are settled.'
                : 'Buyer holds the Handshake PIN. Only reveal it after checking the product.'}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center shrink-0">
            {order.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
        </div>

        {/* Secret 4-Digit Handshake PIN Card */}
        {order.status !== 'completed' && (
          <div className="bg-gray-900 text-white p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <KeyRound className="w-4 h-4" />
                Buyer's Secret Handshake OTP PIN
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">4-Digits</span>
            </div>
            <div className="text-3xl font-black tracking-widest text-center py-2 text-emerald-400 font-mono">
              {order.handshakePin}
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              Show this PIN to the seller only when you meet and verify condition.
            </p>
          </div>
        )}

        {/* Seller Verification PIN Form */}
        {order.status !== 'completed' && (
          <form onSubmit={handleVerify} className="pt-2 space-y-3">
            <span className="text-xs font-bold text-gray-900 block">
              Seller: Enter Buyer's 4-Digit PIN to Claim Payment
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                placeholder="Enter 4-digit PIN..."
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono font-bold text-center text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
              />
              <button
                type="submit"
                disabled={isVerifying || inputPin.length !== 4}
                className="bg-[#1b7a53] hover:bg-[#156343] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Claim'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Order Item Details */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Item Details</h3>
        <div className="flex gap-4">
          <img src={order.productImage} alt={order.productTitle} className="w-16 h-16 rounded-2xl object-cover bg-gray-100" />
          <div className="flex-1 min-w-0 space-y-0.5">
            <h4 className="text-sm font-bold text-gray-900 truncate">{order.productTitle}</h4>
            <p className="text-xs text-gray-500">Seller: {order.sellerName}</p>
            <p className="text-xs font-extrabold text-[#1b7a53]">
              Rs. {order.totalAmount.toLocaleString()} ({order.paymentGateway.toUpperCase()})
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};