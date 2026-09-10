import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import type { ProductItem } from '../../types/marketplace';

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, toggleFavorite } = useMarketplace();
  const favorited = isFavorite(product.id);

  return (
    <div className="group bg-white border border-gray-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Clickable Image Container */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white shadow-2xs transition-all cursor-pointer z-10"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Condition Pill */}
        <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-gray-800 font-bold text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
          {product.condition}
        </span>
      </div>

      {/* Card Content */}
      <Link to={`/product/${product.id}`} className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#1b7a53] transition-colors">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm font-extrabold text-gray-900">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-[11px] text-gray-400 line-through">
                  Rs. {Number(product.originalPrice).toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#1b7a53]">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Footer Meta: Location & Seller */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span className="truncate max-w-[90px] sm:max-w-[110px]">{product.location}</span>
          <span className="flex items-center gap-1 text-gray-700 font-medium truncate max-w-[100px]">
            <span className="truncate">{product.sellerName}</span>
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 shrink-0" />
            <span className="text-gray-900 font-bold">{product.sellerRating}</span>
          </span>
        </div>
      </Link>

    </div>
  );
};