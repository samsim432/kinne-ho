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

  const escrowFee = Math.round(product.price * 0.03 + 45);
  const totalPriceWithEscrow = product.price + escrowFee;

  return (
    <div className="group bg-white rounded-xl overflow-hidden flex flex-col justify-between">
      
      {/* 1. Image Container with Heart Favorite Button */}
      <div className="relative aspect-3/4 bg-gray-100 overflow-hidden rounded-xl">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Favorite Pill Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-gray-700 px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold shadow-xs cursor-pointer backdrop-blur-xs transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-[#e11d48] text-[#e11d48]' : 'text-gray-600'}`} />
          <span>{favorited ? 19 : 18}</span>
        </button>
      </div>

      {/* 2. Metadata: Brand, Size/Condition, Price & Incl. Escrow Fee */}
      <Link to={`/product/${product.id}`} className="pt-2.5 px-0.5 space-y-0.5 block">
        <p className="text-xs font-bold text-gray-900 truncate">
          {product.brand || product.sellerName || 'Authentic'}
        </p>

        <p className="text-[11px] text-gray-500 truncate">
          {product.condition} • {product.location}
        </p>

        <div className="pt-0.5">
          <span className="text-xs font-bold text-gray-900 block">
            Rs. {product.price.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
            <span>Rs. {totalPriceWithEscrow.toLocaleString()} incl.</span>
            <ShieldCheck className="w-3 h-3 text-[#1b7a53]" />
          </span>
        </div>
      </Link>

    </div>
  );
};