import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Plus, 
  X 
} from 'lucide-react';

interface WalletTx {
  id: string;
  type: 'topup' | 'escrow_hold' | 'released' | 'withdrawn';
  title: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Holding in Escrow' | 'Pending';
}

export const Wallet: React.FC = () => {
  const [balance, setBalance] = useState<number>(54000);
  const [inEscrow, setInEscrow] = useState<number>(46000);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState<string>('10000');
  const [selectedMethod, setSelectedMethod] = useState<'esewa' | 'khalti' | 'connectips'>('esewa');

  const [transactions, setTransactions] = useState<WalletTx[]>([
    {
      id: 'tx-1',
      type: 'escrow_hold',
      title: 'Payment Held: iPhone 13 128GB (From Samir Simkhada)',
      amount: 46000,
      date: 'Today, 11:25 AM',
      status: 'Holding in Escrow',
    },
    {
      id: 'tx-2',
      type: 'topup',
      title: 'Loaded via eSewa',
      amount: 50000,
      date: 'Today, 11:00 AM',
      status: 'Completed',
    },
    {
      id: 'tx-3',
      type: 'released',
      title: 'Item Handover Confirmed: Nike Air Max',
      amount: 4500,
      date: 'Sep 08, 2026',
      status: 'Completed',
    }
  ]);

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(topupAmount, 10);
    if (!val || isNaN(val)) return;

    setBalance((prev) => prev + val);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'topup',
        title: `Loaded via ${selectedMethod.toUpperCase()}`,
        amount: val,
        date: 'Just now',
        status: 'Completed',
      },
      ...prev,
    ]);
    setShowTopupModal(false);
  };

  return (
    <div className="py-4 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Kinne Ho? Wallet & Escrow
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Safe payments held in escrow until you inspect and approve items.
          </p>
        </div>

        <button
          onClick={() => setShowTopupModal(true)}
          className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Load Wallet</span>
        </button>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Available Balance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Available Balance</span>
            <WalletIcon className="w-4 h-4 text-[#1b7a53]" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">
            Rs. {balance.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400">Ready to make instant purchases or withdraw.</p>
        </div>

        {/* In-Escrow Funds (Holding) */}
        <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#1b7a53] font-semibold">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Locked in Escrow
            </span>
            <ShieldCheck className="w-4 h-4 text-[#1b7a53]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1b7a53]">
            Rs. {inEscrow.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-600">
            Protected. Released to seller only after your physical confirmation.
          </p>
        </div>

      </div>

      {/* Escrow Mechanism Explanation Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-2xs">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#1b7a53]" />
          <span>How Your Money is Protected in Nepal</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="space-y-1">
            <span className="font-bold text-gray-900 block">1. 100% No Direct Cash Risk</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              When you buy, money is locked in Kinne Ho? Escrow — seller cannot run away with your funds.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-gray-900 block">2. 48-Hour Inspection</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              You receive the item and check its condition. If defective, report within 48 hrs for full refund.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-gray-900 block">3. Instant Seller Payout</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Once you click "Item Received & OK", seller instantly receives their money to their eSewa/Bank.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Transaction & Escrow History
        </h3>

        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${
                  tx.type === 'topup' ? 'bg-emerald-50 text-[#1b7a53]' :
                  tx.type === 'escrow_hold' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {tx.type === 'topup' ? <ArrowDownLeft className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">{tx.title}</h4>
                  <span className="text-[10px] text-gray-400">{tx.date}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs sm:text-sm font-extrabold text-gray-900 block">
                  Rs. {tx.amount.toLocaleString()}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full inline-block ${
                  tx.status === 'Completed' ? 'bg-emerald-50 text-[#1b7a53]' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topup Modal (eSewa / Khalti / ConnectIPS) */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowTopupModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Load Kinne Ho? Wallet</h3>
              <p className="text-xs text-gray-500">Pay safely from your favorite Nepal digital payment provider.</p>
            </div>

            <form onSubmit={handleTopup} className="space-y-4">
              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('esewa')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    selectedMethod === 'esewa'
                      ? 'border-[#60bb46] bg-[#60bb46]/10 text-[#499933]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  eSewa
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('khalti')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    selectedMethod === 'khalti'
                      ? 'border-[#5c2d91] bg-[#5c2d91]/10 text-[#5c2d91]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Khalti
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('connectips')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    selectedMethod === 'connectips'
                      ? 'border-[#0a4b78] bg-[#0a4b78]/10 text-[#0a4b78]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ConnectIPS
                </button>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Amount (Rs.)</label>
                <input
                  type="number"
                  min={100}
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  required
                />
              </div>

              {/* Quick Amount Pills */}
              <div className="flex gap-2">
                {['2000', '5000', '10000', '25000'].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setTopupAmount(amt)}
                    className="flex-1 text-xs py-1 rounded-lg border border-gray-200 hover:border-[#1b7a53] text-gray-600 font-medium"
                  >
                    +{parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold py-2.5 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm"
              >
                Proceed to Load via {selectedMethod.toUpperCase()}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};