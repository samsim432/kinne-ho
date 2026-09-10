import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Plus, 
  X,
  CreditCard,
  Building2,
  Smartphone,
  KeyRound,
  AlertCircle
} from 'lucide-react';

interface WalletTx {
  id: string;
  type: 'topup' | 'withdraw' | 'escrow_hold' | 'released';
  title: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Holding in Escrow' | 'Processing';
  destination?: string;
}

const INITIAL_TRANSACTIONS: WalletTx[] = [
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
    destination: '9841******',
  },
  {
    id: 'tx-3',
    type: 'released',
    title: 'Item Handover Confirmed: Nike Air Max',
    amount: 4500,
    date: 'Sep 08, 2026',
    status: 'Completed',
  }
];

export const Wallet: React.FC = () => {
  const { walletBalance, inEscrowBalance, loadWallet, showToast } = useMarketplace();

  // Transactions State (with LocalStorage)
  const [transactions, setTransactions] = useState<WalletTx[]>(() => {
    const saved = localStorage.getItem('kh_wallet_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('kh_wallet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Modals
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Load Form State
  const [loadMethod, setLoadMethod] = useState<'esewa' | 'khalti' | 'connectips'>('esewa');
  const [loadAmount, setLoadAmount] = useState('5000');
  const [loadPhone, setLoadPhone] = useState('9841234567');
  const [loadOtp, setLoadOtp] = useState('');
  const [isVerifyingLoad, setIsVerifyingLoad] = useState(false);
  const [isProcessingLoad, setIsProcessingLoad] = useState(false);

  // Withdraw Form State
  const [withdrawMethod, setWithdrawMethod] = useState<'esewa' | 'khalti' | 'bank'>('esewa');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('9841234567');
  const [bankName, setBankName] = useState('Nabil Bank');
  const [accountHolder, setAccountHolder] = useState('Samir Simkhada');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  // Execute Load
  const handleInitiateLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(loadAmount, 10);
    if (!amt || amt < 100) {
      showToast('Minimum load amount is Rs. 100', '', 'warning');
      return;
    }
    setIsVerifyingLoad(true);
  };

  const handleConfirmLoadOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingLoad(true);

    setTimeout(() => {
      const amt = parseInt(loadAmount, 10);
      loadWallet(amt, loadMethod);

      const newTx: WalletTx = {
        id: `tx-${Date.now()}`,
        type: 'topup',
        title: `Loaded via ${loadMethod.toUpperCase()}`,
        amount: amt,
        date: 'Just now',
        status: 'Completed',
        destination: loadPhone,
      };

      setTransactions((prev) => [newTx, ...prev]);
      setIsProcessingLoad(false);
      setIsVerifyingLoad(false);
      setShowLoadModal(false);
      setLoadOtp('');
    }, 1000);
  };

  // Execute Withdrawal
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount, 10);

    if (!amt || amt < 500) {
      showToast('Minimum withdrawal amount is Rs. 500', '', 'warning');
      return;
    }

    if (amt > walletBalance) {
      showToast('Insufficient available balance', 'You cannot withdraw more than your available wallet balance.', 'error');
      return;
    }

    setIsProcessingWithdraw(true);

    setTimeout(() => {
      // Deduct balance
      const newBalance = walletBalance - amt;
      localStorage.setItem('kh_wallet_balance', newBalance.toString());
      window.dispatchEvent(new Event('storage')); // sync context

      const destLabel = withdrawMethod === 'bank' 
        ? `${bankName} (${withdrawAccount})`
        : `${withdrawMethod.toUpperCase()} (${withdrawAccount})`;

      const newTx: WalletTx = {
        id: `tx-${Date.now()}`,
        type: 'withdraw',
        title: `Payout to ${destLabel}`,
        amount: amt,
        date: 'Just now',
        status: 'Completed',
        destination: destLabel,
      };

      setTransactions((prev) => [newTx, ...prev]);
      setIsProcessingWithdraw(false);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      showToast(`Rs. ${amt.toLocaleString()} Payout Sent! 🎉`, `Transferred to ${destLabel}`, 'success');
    }, 1200);
  };

  return (
    <div className="py-4 space-y-6 max-w-4xl mx-auto">
      
      {/* Header with Dual Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Kinne Ho? Wallet & Escrow
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Safe payments held in escrow until you inspect and approve items.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4 text-gray-500" />
            <span>Withdraw Funds</span>
          </button>

          <button
            onClick={() => {
              setIsVerifyingLoad(false);
              setShowLoadModal(true);
            }}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Load Wallet</span>
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Available Balance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Available Balance</span>
            <WalletIcon className="w-4 h-4 text-[#1b7a53]" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">
            Rs. {walletBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400">Ready to make instant purchases or withdraw.</p>
        </div>

        {/* Locked in Escrow */}
        <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-6 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#1b7a53] font-semibold">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Locked in Escrow
            </span>
            <ShieldCheck className="w-4 h-4 text-[#1b7a53]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1b7a53]">
            Rs. {inEscrowBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-600">
            Protected. Released to seller only after physical confirmation.
          </p>
        </div>

      </div>

      {/* Escrow Mechanism Notice */}
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

      {/* Transaction & Escrow History */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-2xs">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Transaction & Escrow History
        </h3>

        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  tx.type === 'topup' ? 'bg-emerald-50 text-[#1b7a53]' :
                  tx.type === 'withdraw' ? 'bg-purple-50 text-purple-600' :
                  tx.type === 'escrow_hold' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {tx.type === 'topup' && <ArrowDownLeft className="w-4 h-4" />}
                  {tx.type === 'withdraw' && <ArrowUpRight className="w-4 h-4" />}
                  {tx.type === 'escrow_hold' && <Lock className="w-4 h-4" />}
                  {tx.type === 'released' && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{tx.title}</h4>
                  <span className="text-[10px] text-gray-400 block">{tx.date}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs sm:text-sm font-extrabold block ${
                  tx.type === 'withdraw' ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {tx.type === 'withdraw' ? '-' : '+'} Rs. {tx.amount.toLocaleString()}
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

      {/* 1. LOAD WALLET MODAL (eSewa / Khalti / ConnectIPS) */}
      {showLoadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowLoadModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Load Kinne Ho? Wallet</h3>
              <p className="text-xs text-gray-500">Fast & instant load using Nepal's digital payment providers.</p>
            </div>

            {!isVerifyingLoad ? (
              <form onSubmit={handleInitiateLoad} className="space-y-4">
                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoadMethod('esewa')}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      loadMethod === 'esewa'
                        ? 'border-[#60bb46] bg-[#60bb46]/10 text-[#499933]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    eSewa
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoadMethod('khalti')}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      loadMethod === 'khalti'
                        ? 'border-[#5c2d91] bg-[#5c2d91]/10 text-[#5c2d91]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Khalti
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoadMethod('connectips')}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      loadMethod === 'connectips'
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
                    value={loadAmount}
                    onChange={(e) => setLoadAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-base font-extrabold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                    required
                  />
                </div>

                {/* Quick Pills */}
                <div className="flex gap-2">
                  {['2000', '5000', '10000', '25000'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setLoadAmount(amt)}
                      className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:border-[#1b7a53] text-gray-600 font-semibold"
                    >
                      +{parseInt(amt).toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Phone / ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{loadMethod.toUpperCase()} Mobile / ID</label>
                  <div className="relative flex items-center">
                    <Smartphone className="absolute left-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={loadPhone}
                      onChange={(e) => setLoadPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Pay Rs. {Number(loadAmount || 0).toLocaleString()}</span>
                </button>
              </form>
            ) : (
              /* Simulated Gateway OTP Step */
              <form onSubmit={handleConfirmLoadOtp} className="space-y-4 text-center">
                <div className="p-3 bg-emerald-50 rounded-2xl text-xs text-[#1b7a53] space-y-1">
                  <p className="font-bold">Sandbox Test Authentication</p>
                  <p className="text-[11px] text-gray-600">Enter sample OTP: <strong>123456</strong></p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                    Enter {loadMethod.toUpperCase()} MPIN / OTP
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={loadOtp}
                    onChange={(e) => setLoadOtp(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 text-center text-xl tracking-widest font-extrabold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1b7a53]"
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessingLoad}
                  className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm"
                >
                  {isProcessingLoad ? 'Crediting Wallet...' : `Confirm & Load Rs. ${Number(loadAmount).toLocaleString()}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. WITHDRAW FUNDS MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900">Withdraw Earnings</h3>
              <p className="text-xs text-gray-500">Transfer available balance directly to your eSewa, Khalti, or Bank.</p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              {/* Destination Type */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('esewa')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    withdrawMethod === 'esewa'
                      ? 'border-[#60bb46] bg-[#60bb46]/10 text-[#499933]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  eSewa
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('khalti')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    withdrawMethod === 'khalti'
                      ? 'border-[#5c2d91] bg-[#5c2d91]/10 text-[#5c2d91]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Khalti
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('bank')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    withdrawMethod === 'bank'
                      ? 'border-[#1b7a53] bg-[#1b7a53]/10 text-[#1b7a53]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Bank Transfer
                </button>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-700">Withdrawal Amount (Rs.)</label>
                  <span className="text-gray-400">Available: Rs. {walletBalance.toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  min={500}
                  max={walletBalance}
                  placeholder={`Max Rs. ${walletBalance}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-base font-extrabold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                  required
                />
              </div>

              {/* Bank Details (if Bank selected) */}
              {withdrawMethod === 'bank' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Bank Name</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
                    >
                      <option>Nabil Bank</option>
                      <option>Global IME Bank</option>
                      <option>NIC Asia Bank</option>
                      <option>Sanima Bank</option>
                      <option>Siddhartha Bank</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Account Number</label>
                    <input
                      type="text"
                      placeholder="01201000000492"
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Account Holder Name</label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{withdrawMethod.toUpperCase()} Registered Phone</label>
                  <div className="relative flex items-center">
                    <Smartphone className="absolute left-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingWithdraw || !withdrawAmount || Number(withdrawAmount) > walletBalance}
                className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-xs sm:text-sm disabled:opacity-50"
              >
                {isProcessingWithdraw ? 'Processing Payout...' : `Confirm Withdrawal of Rs. ${Number(withdrawAmount || 0).toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};