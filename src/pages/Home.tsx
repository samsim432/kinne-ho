import React from 'react';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { CategorySection } from '../components/home/CategorySection';
import { NearYouSection } from '../components/home/NearYouSection';
import { TrustSection } from '../components/home/TrustSection';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4 sm:pt-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#1b7a53]" />
            <span className="font-medium text-gray-600">पुरानो होइन, फेरि काम लाग्ने</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">Reuse more, waste less</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#111827] tracking-tight leading-[1.12]">
            Buy Second-Hand.<br />
            <span className="text-[#1b7a53]">Give Things Another Life.</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-lg leading-relaxed">
            Nepal’s trusted peer-to-peer marketplace. Turn your unused electronics, clothes, gaming gear, and books into cash — safely and locally.
          </p>

          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1.5 shadow-2xs max-w-xl">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clothing, electronics, gaming, furniture..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/explore?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                  }
                }}
                className="w-full bg-transparent pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none text-gray-800"
              />
            </div>
            <button 
              onClick={() => navigate('/explore')}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => navigate('/explore')}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all shadow-2xs cursor-pointer flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Items</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/sell')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold px-6 py-3 rounded-lg transition-all shadow-2xs cursor-pointer"
            >
              Sell Something
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 max-w-md border-t border-gray-200/80">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Listings live</p>
              <p className="text-lg font-bold text-gray-900">4,392</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">People selling</p>
              <p className="text-lg font-bold text-gray-900">12,842</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-0.5">Cities covered</p>
              <p className="text-lg font-bold text-gray-900">7</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <HeroSlideshow />
        </div>
      </section>

      {/* Categories Navigator */}
      <CategorySection />

      {/* Popular Near You */}
      <NearYouSection />

      {/* Trust & Pre-Footer Banner */}
      <TrustSection />
    </div>
  );
};