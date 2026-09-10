import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/marketplace/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  // Filter mock saved items
  const [favoriteProducts, setFavoriteProducts] = useState(
    MOCK_PRODUCTS.filter((p) => p.isFavorite || ['1', '5', '7'].includes(p.id))
  );

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-end justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Saved Items</h1>
            <span className="bg-[#1b7a53]/10 text-[#1b7a53] text-xs font-bold px-2 py-0.5 rounded-full">
              {favoriteProducts.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Keep track of prices and items you want to make offers on.
          </p>
        </div>

        {favoriteProducts.length > 0 && (
          <button
            onClick={() => setFavoriteProducts([])}
            className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">No saved items yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Tap the heart icon on any listing on the marketplace to save items here and track price changes.
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};