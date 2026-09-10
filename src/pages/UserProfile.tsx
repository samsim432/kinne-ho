import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/marketplace/ProductCard';
import { Star, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

interface ReviewItem {
  id: string;
  reviewerName: string;
  comment: string;
  rating: number;
  date: string;
}

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    reviewerName: 'Aayush Rai',
    comment: 'Item was exactly as described. Met near Ratnapark, quick and friendly handover.',
    rating: 5,
    date: '2026-08-14'
  },
  {
    id: 'r2',
    reviewerName: 'Sneha Tamang',
    comment: 'Honest about a small scratch before I even asked. Would buy again.',
    rating: 5,
    date: '2026-07-29'
  },
  {
    id: 'r3',
    reviewerName: 'Manish Lama',
    comment: 'Good deal overall, handover took a bit of rescheduling.',
    rating: 4,
    date: '2026-06-11'
  },
  {
    id: 'r4',
    reviewerName: 'Kritika Poudel',
    comment: 'Packed carefully for courier to Pokhara. Everything arrived safe.',
    rating: 5,
    date: '2026-05-02'
  }
];

export const UserProfile: React.FC = () => {
  const { username = 'Samir Simkhada' } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<'listings' | 'sold' | 'reviews' | 'about'>('listings');

  // Filter listings belonging to this seller
  const userListings = MOCK_PRODUCTS.filter(
    (p) => p.sellerName.toLowerCase() === username.toLowerCase()
  );
  
  // If demo seller has only a few, backfill with mock data for preview
  const displayListings = userListings.length > 0 ? userListings : MOCK_PRODUCTS.slice(0, 8);
  const soldListings = MOCK_PRODUCTS.slice(4, 7);

  return (
    <div className="space-y-8 py-4">
      
      {/* Top Profile Card matching Screenshot */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-2xs">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#1b7a53] font-extrabold text-2xl flex items-center justify-center shrink-0">
          SS
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{username}</h1>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              Verified
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1 text-gray-700 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              4.8
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              Kathmandu
            </span>
            <span>32 completed sales</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Joined 2023
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 bg-gray-100/70 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Listings
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'sold'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sold
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          About
        </button>
      </div>

      {/* Tab 1: Listings */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayListings.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Tab 2: Sold Items */}
      {activeTab === 'sold' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 opacity-75">
          {soldListings.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none rounded-xl">
                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                  Sold
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">{review.reviewerName}</h4>
                <div className="flex items-center text-amber-400 gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {review.comment}
              </p>
              <span className="text-[11px] text-gray-400 block pt-1">{review.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: About */}
      {activeTab === 'about' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2 shadow-2xs">
          <h3 className="text-sm font-bold text-gray-900">About {username}</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Selling gadgets I no longer use. Everything tested before handover. Meet-ups around Baneshwor and New Road.
          </p>
        </div>
      )}

    </div>
  );
};