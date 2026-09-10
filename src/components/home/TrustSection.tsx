import React from 'react';
import { 
  Recycle, 
  Tag, 
  Compass, 
  CheckCircle, 
  Eye, 
  MessageSquare, 
  Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TrustSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 py-10">
      
      {/* 1. Give Things Another Life Section */}
      <section className="bg-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Narrative */}
          <div className="lg:col-span-5 space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Give things another life.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Every product has a story. Kinne Ho? makes it easier to pass things on instead of letting useful products sit unused or go to waste.
            </p>
          </div>

          {/* Right 3-Card Value Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Reuse Card */}
            <div className="bg-white border border-gray-200/90 rounded-xl p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1b7a53] flex items-center justify-center">
                <Recycle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Reuse</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Keep products useful for longer.
                </p>
              </div>
            </div>

            {/* Resell Card */}
            <div className="bg-white border border-gray-200/90 rounded-xl p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1b7a53] flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Resell</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Turn unused things into extra income.
                </p>
              </div>
            </div>

            {/* Discover Card */}
            <div className="bg-white border border-gray-200/90 rounded-xl p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1b7a53] flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Discover</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Find useful products at better prices.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Buy With Confidence Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Buy with confidence.
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Second-hand works when people trust each other. These are the basics we build around.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-gray-200/90 rounded-xl p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Verified Profiles</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Build trust between buyers and sellers.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Clear Conditions</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Sellers describe the actual condition of their items.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Offers</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Negotiate prices directly on the platform.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Reviews</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Build reputation through completed transactions.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Pre-Footer Call to Action Banner */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Something sitting unused at home?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Someone's unused item could be your next favourite thing. List yours in a few minutes.
          </p>
        </div>

        <button
          onClick={() => navigate('/sell')}
          className="bg-[#1b7a53] hover:bg-[#156343] text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          Sell Something
        </button>
      </section>

    </div>
  );
};