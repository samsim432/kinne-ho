import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Flag, 
  UserCheck, 
  TrendingUp, 
  Package, 
  Eye, 
  RotateCcw,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DisputeItem {
  id: string;
  orderId: string;
  itemTitle: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  reason: string;
  evidencePhotos: string[];
  status: 'Open Review' | 'Refunded to Buyer' | 'Released to Seller';
  date: string;
}

interface ReportItem {
  id: string;
  itemTitle: string;
  sellerName: string;
  reportedBy: string;
  reason: string;
  status: 'Pending' | 'Dismissed' | 'Removed';
  date: string;
  image: string;
}

const INITIAL_DISPUTES: DisputeItem[] = [
  {
    id: 'disp-1',
    orderId: 'KH-1902',
    itemTitle: 'iPhone 13 128GB Midnight Black',
    buyerName: 'Rohan Shrestha',
    sellerName: 'Samir Simkhada',
    amount: 46000,
    reason: 'Screen has deep touch unresponsiveness near bottom speaker which was not disclosed in condition tags.',
    evidencePhotos: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80'
    ],
    status: 'Open Review',
    date: '15 mins ago',
  },
  {
    id: 'disp-2',
    orderId: 'KH-8491',
    itemTitle: 'PlayStation 5 Disc Edition',
    buyerName: 'Anil Thapa',
    sellerName: 'Pooja Sharma',
    amount: 55000,
    reason: 'Power cable missing from the box during handover.',
    evidencePhotos: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80'
    ],
    status: 'Open Review',
    date: '2 hours ago',
  }
];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    itemTitle: 'Nike Air Max 270 (Suspected Copy)',
    sellerName: 'Bikash Karki',
    reportedBy: 'User_9821',
    reason: 'Suspected Counterfeit / Fake Item (Replica sold as Original)',
    status: 'Pending',
    date: '30 mins ago',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'rep-2',
    itemTitle: 'MacBook Air M1 2020',
    sellerName: 'Suspicious_Seller_01',
    reportedBy: 'Kiran_Dev',
    reason: 'Suspected Scam or Fraudulent Seller (Refusing in-person Handshake OTP)',
    status: 'Pending',
    date: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
  }
];

export const Admin: React.FC = () => {
  const { showToast } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'disputes' | 'reports' | 'verifications'>('disputes');
  const [disputes, setDisputes] = useState<DisputeItem[]>(INITIAL_DISPUTES);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);

  const [verifiedUsers, setVerifiedUsers] = useState<string[]>(['Samir Simkhada', 'Pooja Sharma']);

  // Admin Decision: Refund Buyer
  const handleResolveRefund = (disputeId: string, amount: number) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'Refunded to Buyer' as const } : d))
    );
    showToast(`Dispute #${disputeId} Resolved`, `Rs. ${amount.toLocaleString()} refunded to Buyer wallet.`, 'info');
  };

  // Admin Decision: Release to Seller
  const handleResolveRelease = (disputeId: string, amount: number) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: 'Released to Seller' as const } : d))
    );
    showToast(`Dispute #${disputeId} Resolved`, `Rs. ${amount.toLocaleString()} released to Seller.`, 'success');
  };

  // Report Actions
  const handleReportAction = (reportId: string, action: 'Dismissed' | 'Removed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
    showToast(
      action === 'Removed' ? 'Listing Removed' : 'Report Dismissed',
      action === 'Removed' ? 'Listing was de-indexed from marketplace.' : 'Listing kept active.',
      action === 'Removed' ? 'warning' : 'info'
    );
  };

  return (
    <div className="py-6 space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Staff Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Kinne Ho? Moderation & Trust Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Resolve buyer escrow disputes, review reported items, and verify seller identities.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
            <span>Open Disputes</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {disputes.filter((d) => d.status === 'Open Review').length} Cases
          </p>
          <span className="text-[10px] text-amber-600 font-bold">Escrow Frozen</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
            <span>Pending Reports</span>
            <Flag className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {reports.filter((r) => r.status === 'Pending').length} Listings
          </p>
          <span className="text-[10px] text-red-600 font-bold">Needs Review</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
            <span>Frozen in Escrow</span>
            <Lock className="w-4 h-4 text-[#1b7a53]" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">Rs. 101,000</p>
          <span className="text-[10px] text-[#1b7a53] font-bold">Safe Protection</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
            <span>Verified Sellers</span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{verifiedUsers.length}</p>
          <span className="text-[10px] text-blue-600 font-bold">Nagarikta Checked</span>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'disputes'
              ? 'bg-[#1b7a53] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Escrow Disputes ({disputes.filter((d) => d.status === 'Open Review').length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-[#1b7a53] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Reported Listings ({reports.filter((r) => r.status === 'Pending').length})
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'verifications'
              ? 'bg-[#1b7a53] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          ID Verifications
        </button>
      </div>

      {/* TAB 1: Escrow Disputes */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Case #{d.id}</span>
                  <span className="text-xs font-semibold text-gray-400">· Order {d.orderId}</span>
                  <span className="text-[11px] text-gray-400">· {d.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-[#1b7a53]">
                    Rs. {d.amount.toLocaleString()} Locked
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    d.status === 'Open Review' ? 'bg-amber-100 text-amber-800' :
                    d.status === 'Refunded to Buyer' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-[#1b7a53]'
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Details */}
                <div className="md:col-span-8 space-y-3">
                  <h3 className="text-base font-bold text-gray-900">{d.itemTitle}</h3>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Buyer: <strong>{d.buyerName}</strong></span>
                    <span>•</span>
                    <span>Seller: <strong>{d.sellerName}</strong></span>
                  </div>

                  <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4 text-xs text-red-900 space-y-1">
                    <span className="font-bold block">Buyer Claim:</span>
                    <p className="leading-relaxed">{d.reason}</p>
                  </div>
                </div>

                {/* Photo Evidence */}
                <div className="md:col-span-4 space-y-1.5">
                  <span className="text-xs font-bold text-gray-700 block">Submitted Evidence</span>
                  <div className="aspect-4/3 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={d.evidencePhotos[0]} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                </div>

              </div>

              {/* Resolution Action Bar */}
              {d.status === 'Open Review' && (
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-end gap-3">
                  <button
                    onClick={() => handleResolveRefund(d.id, d.amount)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Approve 100% Refund to Buyer</span>
                  </button>

                  <button
                    onClick={() => handleResolveRelease(d.id, d.amount)}
                    className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dismiss Claim & Release Funds to Seller</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Reported Listings */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-3xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={r.image} alt={r.itemTitle} className="w-16 h-16 rounded-2xl object-cover bg-gray-100 shrink-0" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    {r.reason.split(' (')[0]}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">{r.itemTitle}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Seller: {r.sellerName}</span>
                    <span>•</span>
                    <span>Reported by: {r.reportedBy}</span>
                    <span>•</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {r.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleReportAction(r.id, 'Dismissed')}
                      className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleReportAction(r.id, 'Removed')}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Remove Listing
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {r.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Seller Verifications */}
      {activeTab === 'verifications' && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900">Nagarikta / National ID Submissions</h3>
          <p className="text-xs text-gray-500">Approving gives sellers the trusted blue checkmark badge.</p>

          <div className="divide-y divide-gray-100">
            {['Suman KC (Kathmandu)', 'Prashant Adhikari (Pokhara)'].map((name, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    ID
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">{name}</h4>
                    <span className="text-[11px] text-gray-400">Nagarikta #27-01-78-01928</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('ID Approved', `${name} is now a Verified Seller.`, 'success')}
                    className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Approve Badge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};