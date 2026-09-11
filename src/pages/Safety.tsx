import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  KeyRound, 
  Truck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Safety: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#1b7a53] px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Trust & Safety Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          How Kinne Ho? Protects Buyers & Sellers
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          We eliminated fraud from second-hand transactions in Nepal with our double-locked Escrow & Handshake OTP protocol.
        </p>
      </div>

      {/* 3 Steps Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
            1
          </div>
          <h3 className="text-base font-bold text-gray-900">Funds Locked in Escrow</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            When you purchase an item via eSewa or Wallet, money is never sent directly to the seller. It stays safely locked in Kinne Ho? Escrow.
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
            2
          </div>
          <h3 className="text-base font-bold text-gray-900">48h In-Person Inspection</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Meet the seller or receive doorstep delivery. Inspect battery health, material, and defects to ensure it matches the listing description.
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
            3
          </div>
          <h3 className="text-base font-bold text-gray-900">Handshake OTP Release</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Once satisfied, provide your secret 4-digit Handshake PIN. The seller enters the PIN to immediately claim payout to their balance.
          </p>
        </div>
      </div>

      {/* Safety Tips Card */}
      <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#1b7a53]" />
          <span>Golden Rules for Nepali Marketplace Safety</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50">
            <CheckCircle2 className="w-4 h-4 text-[#1b7a53] shrink-0 mt-0.5" />
            <span><strong>Never transfer advance cash:</strong> Always pay through the Escrow button so your payment is protected.</span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50">
            <CheckCircle2 className="w-4 h-4 text-[#1b7a53] shrink-0 mt-0.5" />
            <span><strong>Keep Handshake PIN Secret:</strong> Do not share your 4-digit OTP until you test the device/item in person.</span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50">
            <CheckCircle2 className="w-4 h-4 text-[#1b7a53] shrink-0 mt-0.5" />
            <span><strong>Disclose all flaws as seller:</strong> Mention minor wear and scratches to prevent dispute refunds.</span>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50">
            <CheckCircle2 className="w-4 h-4 text-[#1b7a53] shrink-0 mt-0.5" />
            <span><strong>Use Public Meeting Points:</strong> Meet at busy chowks, tea shops, or malls for local handover.</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-500">Need help with an ongoing transaction?</span>
          <button
            onClick={() => navigate('/admin')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Open Dispute Arbiter
          </button>
        </div>
      </div>

    </div>
  );
};