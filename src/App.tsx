import React from 'react';
import { Navbar } from './components/navbar/Navbar';
import { HeroSlideshow } from './components/home/HeroSlideshow';
import { Search, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F9FAF9] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Column: Brand Content & Action Engine */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Mission Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#1b7a53]" />
              <span className="font-medium text-gray-600">पुरानो होइन, फेरि काम लाग्ने</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">Reuse more, waste less</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#111827] tracking-tight leading-[1.12]">
              Buy Second-Hand.<br />
              <span className="text-[#1b7a53]">Give Things Another Life.</span>
            </h1>

            {/* Nepali Context Subtext */}
            <p className="text-gray-600 text-base sm:text-lg max-w-lg leading-relaxed">
              Nepal’s trusted peer-to-peer marketplace. Turn your unused electronics, clothes, gaming gear, and books into cash — safely and locally.
            </p>

            {/* Smart Search Bar */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1.5 shadow-xs max-w-xl focus-within:border-[#1b7a53] focus-within:ring-1 focus-within:ring-[#1b7a53] transition-all">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search iPhone, Nike jackets, PS5, textbooks..."
                  className="w-full bg-transparent pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none text-gray-800"
                />
              </div>
              <button 
                type="button"
                className="bg-[#1b7a53] hover:bg-[#156343] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Search</span>
              </button>
            </div>

            {/* Call to Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button 
                type="button"
                className="bg-[#1b7a53] hover:bg-[#156343] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-2 group"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Items</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              
              <button 
                type="button"
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold px-6 py-3 rounded-lg transition-all shadow-xs cursor-pointer"
              >
                Sell Something
              </button>
            </div>

            {/* Trust & Marketplace Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-6 max-w-md border-t border-gray-200/80">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Verified Listings</p>
                <p className="text-lg font-bold text-gray-900">4,390+</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Active Sellers</p>
                <p className="text-lg font-bold text-gray-900">12,800+</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Major Cities</p>
                <p className="text-lg font-bold text-gray-900">Kathmandu + 6</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Live Slideshow */}
          <div className="lg:col-span-6">
            <HeroSlideshow />
          </div>

        </div>
      </main>
    </div>
  );
}