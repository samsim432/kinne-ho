import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HeroSlideshow: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f0fdf4]/50 via-white to-transparent rounded-3xl p-6 sm:p-10 lg:p-12 border border-emerald-100/60 shadow-2xs">
      <div className="max-w-3xl space-y-6">
        
        {/* Eco & Safety Tag */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1b7a53]">
          <span className="w-2 h-2 rounded-full bg-[#1b7a53] animate-pulse"></span>
          <span>पुरानो होइन, फेरि काम लाग्ने • Reuse more, waste less</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Buy Second-Hand.<br />
            <span className="text-[#1b7a53]">Give Things Another Life.</span>
          </h1>
          <p className="text-xs sm:text-base text-gray-600 max-w-xl leading-relaxed">
            Nepal’s trusted peer-to-peer marketplace. Turn your unused electronics, clothes, gaming gear, and books into cash — safely and locally.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm focus-within:border-[#1b7a53] focus-within:ring-1 focus-within:ring-[#1b7a53] transition-all">
          <div className="pl-3 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search clothing, electronics, gaming, furniture..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent px-2"
          />
          <button
            type="submit"
            className="bg-[#1b7a53] hover:bg-[#156343] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        {/* Action CTAs */}
        <div className="flex items-center flex-wrap gap-3 pt-2">
          <button
            onClick={() => navigate('/explore')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/sell')}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            Sell Something
          </button>
        </div>

        {/* Platform Counter Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 max-w-lg">
          <div>
            <span className="text-[11px] font-bold text-gray-400 block">Listings Live</span>
            <span className="text-base sm:text-xl font-black text-gray-900">4,392</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 block">People Selling</span>
            <span className="text-base sm:text-xl font-black text-gray-900">12,842</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 block">Cities Covered</span>
            <span className="text-base sm:text-xl font-black text-gray-900">7 Valleys</span>
          </div>
        </div>

      </div>
    </div>
  );
};