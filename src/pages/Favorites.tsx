import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/marketplace/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites } = useMarketplace();

  const savedProducts = MOCK_PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="py-4 max-w-7xl mx-auto space-y-6">
      
      <div className="space-y-1 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Saved Wishlist
          </h1>
          <span className="text-xs font-bold text-[#1b7a53] bg-emerald-50 px-2.5 py-0.5 rounded-full">
            {savedProducts.length} items
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500">
          Track price changes and quick-buy items you have bookmarked.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center space-y-4 shadow-2xs max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">Your wishlist is empty</h3>
            <p className="text-xs text-gray-500">
              Click the heart icon on any product to save it here for later.
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {savedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}

    </div>
  );
};