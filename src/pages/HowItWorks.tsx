import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Truck, 
  Wallet, 
  KeyRound, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Search,
  MessageSquare
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-14 py-4 sm:py-8 max-w-5xl mx-auto pb-20">
      
      {/* 1. Hero Introduction */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-[#f0fdf4] text-[#1b7a53] px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>पुरानो होइन, फेरि काम लाग्ने • Reuse more, waste less</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1.15]">
          Kinne Ho? is Nepal’s trusted platform for pre-owned pieces you’ll love
        </h1>

        <p className="text-xs sm:text-base text-gray-600 leading-relaxed font-normal">
          One community across Kathmandu, Lalitpur, Pokhara, and all 7 Valleys. Thousands of verified items and a whole lot of second-hand value. Ready to get started? Here’s how it works.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/sell')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
          >
            Start Selling (0% Fee)
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
          >
            Explore Items
          </button>
        </div>
      </section>

      {/* 2. Selling is Simple (3 Steps) */}
      <section className="space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Selling is simple</h2>
          <p className="text-xs text-gray-500">Turn unused electronics, clothing, gear, and books into cash.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sell Step 1 */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-gray-900">1. List for free</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Take 2–4 daylight photos of your item, choose the category, and set your asking price. Tap "Publish" and your listing goes live across Nepal.
              </p>
            </div>
            <button
              onClick={() => navigate('/safety')}
              className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Learn listing tips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sell Step 2 */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-gray-900">2. Sell it, hand it over</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sold! Coordinate with the buyer in chat. Meet at a local chowk (e.g. New Baneshwor, Patan, Lakeside) or send via doorstep courier.
              </p>
            </div>
            <button
              onClick={() => navigate('/safety')}
              className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Learn handover rules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sell Step 3 */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-gray-900">3. It’s payday!</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ask the buyer for their 4-digit Handshake OTP. Enter it on your order screen to instantly claim 100% of the funds to your eSewa, Khalti, or Bank.
              </p>
            </div>
            <button
              onClick={() => navigate('/wallet')}
              className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Learn about payouts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. Shop Safely and Securely (3 Steps) */}
      <section className="space-y-6">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shop safely and securely</h2>
          <p className="text-xs text-gray-500">Discover great deals with complete peace of mind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Buy Step 1 */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-gray-900">1. Find it</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Browse thousands of pre-loved iPhones, jackets, PlayStation consoles, and college textbooks. Filter by your exact city, condition, and budget.
              </p>
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Explore catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Buy Step 2 */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-gray-900">2. Make an offer or buy</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Negotiate a price with the seller, then lock the transaction securely using eSewa, Khalti Sandbox, or your Kinne Ho? Wallet Balance.
              </p>
            </div>
            <button
              onClick={() => navigate('/safety')}
              className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Learn about offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Buy Step 3 */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-gray-900">3. Inspect & release PIN</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Meet the seller or unbox delivery. Test the device and fabric. Give your 4-digit Handshake PIN only when you confirm everything is 100% OK.
              </p>
            </div>
            <button
              onClick={() => navigate('/safety')}
              className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 pt-2 cursor-pointer"
            >
              <span>Learn inspection rules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. You’re Safe With Us (Escrow & Buyer Protection) */}
      <section className="bg-[#f0f9f5] border-2 border-[#d2efe2] rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-[#1b7a53] px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Escrow Trust Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">You’re safe with us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pillar 1: Buyer Protection */}
          <div className="bg-white rounded-2xl p-6 shadow-2xs space-y-3 border border-emerald-100/80">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#1b7a53]" />
              <span>Shop with peace of mind</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When buying with the "Buy now" button, your payment is held in Escrow and protected by our Handshake PIN protocol. The seller does not receive money upfront, preventing advance cash scams.
            </p>
            <button
              onClick={() => navigate('/safety')}
              className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>Learn more about Escrow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2: Reliable Refund Policy */}
          <div className="bg-white rounded-2xl p-6 shadow-2xs space-y-3 border border-emerald-100/80">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#1b7a53]" />
              <span>Reliable refund policy</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your money is 100% protected. If the item never arrives, is broken, or is significantly not as described, withhold your 4-digit PIN and notify our Escrow Arbiter team for a full refund.
            </p>
            <button
              onClick={() => navigate('/admin')}
              className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>Learn about refund arbitration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Ready to go CTA */}
      <section className="bg-gray-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
          Ready to declutter and buy second-hand?
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Join thousands of members across Nepal giving unused items a second life.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/sell')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md"
          >
            Sell something today
          </button>
          <button
            onClick={() => navigate('/auth?mode=select')}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
          >
            Create free account
          </button>
        </div>
      </section>

    </div>
  );
};