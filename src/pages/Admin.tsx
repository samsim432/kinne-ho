import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  Eye, 
  Check, 
  X,
  Lock
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { showToast } = useMarketplace();

  const [disputes, setDisputes] = useState([
    {
      id: 'DSP-102',
      orderId: 'KH-8941',
      buyer: 'Shruti Maharjan',
      seller: 'Samir Simkhada',
      item: 'iPhone 13 128GB (Rs. 48,000)',
      amount: 48000,
      reason: 'Battery health was 79% instead of advertised 88%.',
      evidence: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
      status: 'Under Review'
    }
  ]);

  const handleResolveRefund = (id: string) => {
    setDisputes((prev) => prev.filter((d) => d.id !== id));
    showToast('Escrow Refunded 🔄', 'Full Rs. 48,000 refunded to buyer wallet balance.', 'success');
  };

  const handleResolveRelease = (id: string) => {
    setDisputes((prev) => prev.filter((d) => d.id !== id));
    showToast('Escrow Payout Released 🤝', 'Seller was validated. Funds released to seller wallet.', 'success');
  };

  return (
    <div className="py-4 max-w-4xl mx-auto space-y-6">
      
      <div className="space-y-1 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Admin Moderation & Escrow Arbiter
          </h1>
        </div>
        <p className="text-xs text-gray-500">
          Review contested handovers, inspect photo evidence, and make binding escrow payout decisions.
        </p>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-2 shadow-2xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">All Disputes Resolved</h3>
          <p className="text-xs text-gray-500">No active escrow disputes in queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white border-2 border-red-100 rounded-3xl p-6 shadow-card space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                    {d.status} • Dispute ID: {d.id}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-1">{d.item}</h3>
                  <p className="text-xs text-gray-500">Order Ref: {d.orderId}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 block">Locked Escrow</span>
                  <span className="text-lg font-black text-red-600">Rs. {d.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4 text-xs">
                <div>
                  <span className="font-bold text-gray-500 block">Buyer Complaint</span>
                  <p className="text-gray-900 font-medium mt-0.5">{d.reason}</p>
                  <p className="text-gray-400 text-[10px] mt-1">Filed by: {d.buyer}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 block">Seller Stance</span>
                  <p className="text-gray-900 font-medium mt-0.5">Item matched listed description and images.</p>
                  <p className="text-gray-400 text-[10px] mt-1">Seller: {d.seller}</p>
                </div>
              </div>

              {/* Arbiter Action Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">Admin Resolution:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolveRefund(d.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refund Buyer (100%)</span>
                  </button>
                  <button
                    onClick={() => handleResolveRelease(d.id)}
                    className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Release to Seller</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};