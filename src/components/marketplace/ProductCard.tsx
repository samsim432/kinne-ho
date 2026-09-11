import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import type { ProductItem } from '../../types/marketplace';

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, toggleFavorite } = useMarketplace();
  const favorited = isFavorite(product.id);

  const escrowFee = Math.round(product.price * 0.03);
  const totalPriceWithProtection = product.price + escrowFee;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-gray-200/80 shadow-2xs hover:shadow-md transition-all">
      
      {/* Product Image Container */}
      <div className="relative aspect-3/4 bg-gray-100 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-gray-700 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold shadow-xs cursor-pointer backdrop-blur-xs"
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          <span>{favorited ? 19 : 18}</span>
        </button>

        {/* Condition Tag */}
        <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          {product.condition}
        </span>
      </div>

      {/* Product Metadata Details */}
      <Link to={`/product/${product.id}`} className="p-3 space-y-1 block">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#1b7a53] transition-colors">
          {product.title}
        </h3>

        <p className="text-[11px] text-gray-400 truncate">
          {product.location} • {product.sellerName}
        </p>

        <div className="pt-1 flex items-baseline justify-between">
          <span className="text-sm font-extrabold text-gray-900">
            Rs. {product.price.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
            <span>Rs. {totalPriceWithProtection.toLocaleString()}</span>
            <ShieldCheck className="w-3 h-3 text-[#1b7a53]" />
          </span>
        </div>
      </Link>

    </div>
  );
};