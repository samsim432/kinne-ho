import React, { useState } from 'react';
import { X, Smartphone, KeyRound, Lock, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { toPaisa } from '../../lib/khalti';

interface KhaltiModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountInRs: number;
  productTitle: string;
  onSuccess: (transactionId: string) => void;
}

export const KhaltiModal: React.FC<KhaltiModalProps> = ({
  isOpen,
  onClose,
  amountInRs,
  productTitle,
  onSuccess,
}) => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [phone, setPhone] = useState('9800000001'); // Official Khalti test phone
  const [mpin, setMpin] = useState('1111'); // Official Khalti test MPIN
  const [otp, setOtp] = useState('987654'); // Official Khalti test OTP
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const fakeKhaltiTxId = `KHL-${Date.now()}`;
      onSuccess(fakeKhaltiTxId);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Khalti Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5C2D91] text-white flex items-center justify-center font-black text-sm">
            K
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Khalti Digital Wallet</h3>
            <span className="text-[10px] text-[#5C2D91] font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Sandbox Test Gateway
            </span>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-3 flex justify-between items-center text-xs">
          <span className="text-gray-600 truncate max-w-[160px]">{productTitle}</span>
          <span className="font-extrabold text-[#5C2D91] text-sm">
            Rs. {amountInRs.toLocaleString()}
          </span>
        </div>

        {step === 'mobile' ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Khalti Mobile Number</label>
              <div className="relative flex items-center">
                <Smartphone className="w-4 h-4 text-gray-400 absolute left-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#5C2D91]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">4-Digit Khalti MPIN</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3" />
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#5C2D91]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5C2D91] hover:bg-[#4a2475] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Get OTP Code</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyPayment} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Enter OTP Code (Test: 987654)</label>
              <div className="relative flex items-center">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="987654"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-sm font-mono font-bold text-center text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#5C2D91]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5C2D91] hover:bg-[#4a2475] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Escrow Lock...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Pay Rs. {amountInRs.toLocaleString()}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('mobile')}
              className="w-full text-center text-[11px] font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Change phone number
            </button>
          </form>
        )}

        <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-1.5 text-[10px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5C2D91] shrink-0" />
          <span>Test Credentials: 9800000001 • MPIN: 1111 • OTP: 987654</span>
        </div>
      </div>
    </div>
  );
};