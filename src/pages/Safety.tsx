import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Safety: React.FC = () => {
  return (
    <div className="py-6 max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b7a53]/10 text-[#1b7a53] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trust & Marketplace Safety</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          How to Buy & Sell Safely on Kinne Ho?
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          We designed Kinne Ho? to make peer-to-peer commerce in Nepal secure, transparent, and respectful. Follow these golden rules for every meetup.
        </p>
      </div>

      {/* Core Safety Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Rule 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Meet in Busy Public Places</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Always arrange pickups in well-lit public locations during daylight hours (e.g., shopping centers, busy chowks, or cafes around Ratnapark, New Road, or Baneshwor).
          </p>
        </div>

        {/* Rule 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Inspect Electronics In-Person</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Test phones, laptops, and consoles before making payment. Check battery health, camera functionality, charging ports, and screen touch responsiveness.
          </p>
        </div>

        {/* Rule 3 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Never Send Advance Payments</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Do not send advance deposits to strangers online before inspecting the physical item. Pay via digital wallet (eSewa / Khalti / Mobile Banking) or cash only when satisfied.
          </p>
        </div>

        {/* Rule 4 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Keep Chats on Kinne Ho?</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Keep all negotiation records and agreed prices inside the platform’s chat feed. This provides documented proof in case of disputes.
          </p>
        </div>

      </div>

      {/* Need Help Banner */}
      <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <HelpCircle className="w-4 h-4 text-[#1b7a53]" />
            <span>Spotted a suspicious listing?</span>
          </div>
          <p className="text-xs text-gray-600 max-w-lg">
            Our moderation team continuously monitors for prohibited goods, fake replicas, and scam attempts.
          </p>
        </div>
        <Link
          to="/explore"
          className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0 text-center"
        >
          Explore Safe Deals
        </Link>
      </div>

    </div>
  );
};