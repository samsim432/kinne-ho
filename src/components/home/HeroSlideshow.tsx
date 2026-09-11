import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const HeroSlideshow: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSellClick = () => {
    if (!user) {
      navigate('/auth?mode=select&redirect=sell');
    } else {
      navigate('/sell');
    }
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden my-4 sm:my-6 bg-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
      
      {/* Editorial Hero Background Image */}
      <div className="relative h-[420px] sm:h-[460px] lg:h-[500px] w-full">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85"
          alt="Nepali street fashion decluttering"
          className="w-full h-full object-cover object-[center_30%] scale-100 transition-transform duration-700 hover:scale-102"
        />
        {/* Soft Vignette Gradient for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent sm:from-black/35" />
      </div>

      {/* Floating Card */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-10 lg:left-14 w-[calc(100%-2rem)] sm:w-[380px] lg:w-[410px] bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-white/70 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
        
        {/* Slogan Pill */}
        <div className="inline-flex items-center gap-1.5 bg-[#f0fdf4] text-[#1b7a53] px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-200/70 shadow-2xs">
          <Sparkles className="w-3 h-3 text-[#1b7a53]" />
          <span>पुरानो होइन, फेरि काम लाग्ने</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-[1.2] tracking-tight">
            Ready to declutter and sell in Nepal?
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Turn your unused clothes, phones, gaming gear, and books into cash with 100% Escrow and Handshake OTP protection.
          </p>
        </div>

        {/* Primary Sell CTA */}
        <div className="pt-1 space-y-2.5">
          <button
            type="button"
            onClick={handleSellClick}
            className="w-full bg-[#1b7a53] hover:bg-[#156343] active:scale-[0.99] text-white font-bold py-3.5 px-5 rounded-xl transition-all text-sm tracking-wide text-center cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <span>Sell now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Learn Link */}
          <button
            type="button"
            onClick={() => navigate('/safety')}
            className="w-full text-center text-xs font-semibold text-gray-600 hover:text-[#1b7a53] transition-colors cursor-pointer py-1 flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1b7a53]" />
            <span className="hover:underline">Learn how Escrow works</span>
          </button>
        </div>

      </div>

    </section>
  );
};