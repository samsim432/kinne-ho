import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { ProductItem } from '../../types/marketplace';

interface ProductCardProps {
  product: ProductItem;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [isFav, setIsFav] = useState(product.isFavorite || false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors shadow-xs"
          aria-label="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Condition Tag */}
        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/90 backdrop-blur-xs text-gray-700 border border-gray-100 shadow-2xs">
          {product.condition}
        </span>
      </div>

      {/* Details Box */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#1b7a53] transition-colors line-clamp-1">
            {product.title}
          </h4>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-sm font-bold text-gray-900">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs text-[#1b7a53] font-semibold">
                  -{discount}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Location & Seller Footer */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="truncate">{product.location} · {product.timeAgo}</span>
          <div className="flex items-center gap-1 shrink-0 font-medium">
            <span>{product.sellerName}</span>
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <span className="text-[11px] text-gray-700 ml-0.5">{product.sellerRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};