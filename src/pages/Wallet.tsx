import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Lock, 
  ShieldCheck, 
  Plus, 
  RefreshCw 
} from 'lucide-react';

export const Wallet: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useMarketplace();

  const [balance, setBalance] = useState(profile?.wallet_balance || 50000);
  const [inEscrow] = useState(profile?.in_escrow_balance || 48000);

  const transactions = [
    {
      id: 'tx-1',
      title: 'Escrow Locked for iPhone 13',
      date: 'Today, 2:15 PM',
      amount: '- Rs. 48,000',
      type: 'hold',
      status: 'In Escrow'
    },
    {
      id: 'tx-2',
      title: 'Welcome Sandbox Top-up',
      date: 'Sep 10, 2026',
      amount: '+ Rs. 50,000',
      type: 'topup',
      status: 'Completed'
    }
  ];

  const handleTopupDemo = () => {
    setBalance((prev) => prev + 10000);
    showToast('Wallet Credited! 💳', 'Rs. 10,000 sandbox funds added to your balance.', 'success');
  };

  return (
    <div className="py-4 max-w-3xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Wallet & Escrow</h1>
        <p className="text-xs text-gray-500">Track available balances and funds held in safe escrow.</p>
      </div>

      {/* Balances Card */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-card grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <WalletIcon className="w-4 h-4 text-[#1b7a53]" />
            Available Balance
          </span>
          <p className="text-3xl font-extrabold text-gray-900">
            Rs. {balance.toLocaleString()}
          </p>
          <button
            onClick={handleTopupDemo}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Top Up (Demo)</span>
          </button>
        </div>

        <div className="space-y-2 sm:border-l sm:border-gray-100 sm:pl-6">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-500" />
            Protected in Escrow
          </span>
          <p className="text-3xl font-extrabold text-amber-600">
            Rs. {inEscrow.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-400 block">
            Releases instantly when buyer verifies 4-digit PIN.
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900">Transaction History</h3>

        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  tx.type === 'hold' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-[#1b7a53]'
                }`}>
                  {tx.type === 'hold' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{tx.title}</h4>
                  <span className="text-[10px] text-gray-400">{tx.date}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-extrabold block ${
                  tx.type === 'hold' ? 'text-amber-600' : 'text-[#1b7a53]'
                }`}>
                  {tx.amount}
                </span>
                <span className="text-[10px] text-gray-400">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};