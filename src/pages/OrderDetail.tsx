import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useMarketplace } from '../context/MarketplaceContext';
import { decodeEsewaResponse } from '../lib/esewa';
import { 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  ArrowLeft,
  Lock,
  Sparkles,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';

export const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getOrderById, verifyHandshakePin, showToast } = useMarketplace();

  const [inputPin, setInputPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  const order = getOrderById(orderId || 'KH-8941');

  // Handle returning from eSewa Callback (?data=base64_string)
  useEffect(() => {
    const esewaData = searchParams.get('data');
    if (esewaData) {
      const decoded = decodeEsewaResponse(esewaData);
      if (decoded && decoded.status === 'COMPLETE') { //
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast('Payment Verified! 🇳🇵', 'eSewa funds are safely held in Kinne Ho? Escrow.', 'success');
      }
    }
  }, [searchParams]);

  if (!order) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <button
          onClick={() => navigate('/my-listings')}
          className="bg-[#1b7a53] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
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
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 600);
  };

  const copyHandshakePin = () => {
    navigator.clipboard.writeText(order.handshakePin);
    setCopiedPin(true);
    showToast('PIN Copied', 'Share this PIN with the seller after testing the item.', 'info');
    setTimeout(() => setCopiedPin(false), 2000);
  };

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <span className="text-xs font-mono font-bold text-gray-400">Order ID: {order.id}</span>
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
              {order.status === 'completed' ? 'Deal Completed & Funds Released' : 'Funds Safely Locked in Escrow'}
            </span>
            <h2 className="text-xl font-extrabold text-gray-900">
              {order.status === 'completed' ? 'Handover Confirmed 🎉' : 'Inspection & Handover Pending'}
            </h2>
            <p className="text-xs text-gray-500">
              {order.status === 'completed'
                ? 'The 4-digit Handshake OTP was verified. Funds are settled to seller balance.'
                : 'Buyer holds the Handshake PIN. Only reveal it after checking the product in person.'}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center shrink-0">
            {order.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
        </div>

        {/* Secret 4-Digit Handshake PIN Card */}
        {order.status !== 'completed' && (
          <div className="bg-gray-900 text-white p-5 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <KeyRound className="w-4 h-4" />
                Buyer's Secret Handshake OTP PIN
              </span>
              <button
                type="button"
                onClick={copyHandshakePin}
                className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedPin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPin ? 'Copied' : 'Copy PIN'}</span>
              </button>
            </div>

            <div className="text-4xl font-black tracking-widest text-center py-2 text-emerald-400 font-mono">
              {order.handshakePin}
            </div>

            <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Show this PIN to the seller only when you meet and verify condition.</span>
            </div>
          </div>
        )}

        {/* Seller Verification PIN Form */}
        {order.status !== 'completed' && (
          <form onSubmit={handleVerify} className="pt-2 space-y-3 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-900 block">
              Seller: Enter Buyer's 4-Digit PIN to Claim Payout
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                placeholder="4-digit PIN..."
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-base font-mono font-bold text-center text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
              />
              <button
                type="submit"
                disabled={isVerifying || inputPin.length !== 4}
                className="bg-[#1b7a53] hover:bg-[#156343] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
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
          <img src={order.productImage} alt={order.productTitle} className="w-16 h-16 rounded-2xl object-cover bg-gray-100 border border-gray-100" />
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