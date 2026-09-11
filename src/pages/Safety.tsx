import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Wallet, 
  HelpCircle,
  Tag, 
  Truck, 
  UserCheck, 
  AlertCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Safety: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const topics = [
    {
      id: 'selling',
      title: 'Selling on Kinne Ho?',
      image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80',
      articles: [
        { title: 'How to list your first item with photos', link: '/sell' },
        { title: 'Understanding Handshake OTP payment release', link: '#handshake' },
        { title: 'Withdrawing funds to eSewa, Khalti, or Bank', link: '/wallet' },
        { title: 'Managing & editing your active listings', link: '/my-listings' },
      ],
    },
    {
      id: 'buying',
      title: 'Buying & Escrow Safety',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
      articles: [
        { title: 'How Kinne Ho? Escrow protects your money', link: '#escrow' },
        { title: 'Inspecting devices & clothes before giving PIN', link: '#inspection' },
        { title: 'Making price offers & counter-negotiations', link: '/explore' },
        { title: 'Doorstep Delivery vs Local Self-Pickup', link: '#delivery' },
      ],
    },
    {
      id: 'account',
      title: 'Account & Verification',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      articles: [
        { title: 'Updating name, phone & default delivery area', link: '/auth' },
        { title: 'Nagarikta / ID verification badge benefits', link: '#kyc' },
        { title: 'Resetting forgotten passwords via email', link: '/auth?mode=forgot' },
        { title: 'Trust rules & zero-tolerance scam policies', link: '#rules' },
      ],
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Top Hero Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#1b7a53] text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[300px] sm:min-h-[340px]">
          
          {/* Left Column: Search & Title */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-5 z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              How can we help?
            </h1>

            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type your question (e.g. Escrow, Handshake PIN, eSewa)..."
                className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          {/* Right Column: Hero Graphic Banner */}
          <div className="lg:col-span-6 h-full min-h-[220px] lg:min-h-[340px] relative">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
              alt="Happy Nepali youth using mobile marketplace"
              className="w-full h-full object-cover object-center mix-blend-luminosity opacity-40 lg:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1b7a53] via-transparent to-transparent"></div>
          </div>

        </div>
      </div>

      {/* Specific Order Helper Banner */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-3">
        <h2 className="text-sm font-bold text-gray-900">
          I need help with a specific order or transaction
        </h2>

        <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100">
          <div>
            <p className="text-xs text-gray-600 font-medium">
              {user
                ? 'Check real-time escrow hold status, your 4-digit Handshake OTP, or open a dispute.'
                : 'Log in to view active escrow orders, track Handshake verification, and contact support.'}
            </p>
          </div>

          {!user ? (
            <button
              onClick={() => navigate('/auth?mode=select')}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs text-center"
            >
              Log in or sign up
            </button>
          ) : (
            <button
              onClick={() => navigate('/wallet')}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs text-center"
            >
              View My Escrow Orders
            </button>
          )}
        </div>
      </div>

      {/* Browse by Topic Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Browse by topic</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden shadow-2xs flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                {/* Topic Image */}
                <div className="h-44 w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <h3 className="absolute bottom-3 left-4 text-white font-extrabold text-base">
                    {topic.title}
                  </h3>
                </div>

                {/* Topic Articles */}
                <div className="p-4 space-y-2">
                  {topic.articles.map((art, idx) => (
                    <Link
                      key={idx}
                      to={art.link}
                      className="text-xs text-gray-600 hover:text-[#1b7a53] hover:underline flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                    >
                      <span className="truncate pr-2">{art.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0 border-t border-gray-50">
                <Link
                  to="/explore"
                  className="text-xs font-bold text-[#1b7a53] hover:underline inline-flex items-center gap-1"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kinne Ho? 3-Pillar Security Architecture */}
      <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-[#1b7a53] px-3 py-1 rounded-full text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Nepali P2P Marketplace Guarantee</span>
          </div>
          <h3 className="text-xl font-black text-gray-900">
            How Escrow & Handshake PIN Protect Every Rupee
          </h3>
          <p className="text-xs text-gray-600">
            You are 100% protected against advance payment scams and fake product listings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-gray-900">Buyer Pays via eSewa/Khalti</h4>
            <p className="text-gray-500 leading-relaxed">
              Money is held safely in Kinne Ho? Escrow. The seller does not receive payment yet.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-gray-900">In-Person Item Inspection</h4>
            <p className="text-gray-500 leading-relaxed">
              Meet at a local chowk or receive doorstep delivery. Inspect condition, battery health, and fit.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-gray-900">4-Digit Handshake OTP</h4>
            <p className="text-gray-500 leading-relaxed">
              Give your PIN to the seller only when satisfied. The seller enters the PIN to claim their wallet payout.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 border-t border-emerald-200/60">
          <span>Having an issue with an ongoing deal?</span>
          <button
            onClick={() => navigate('/admin')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Contact Escrow Arbiter
          </button>
        </div>
      </div>

    </div>
  );
};