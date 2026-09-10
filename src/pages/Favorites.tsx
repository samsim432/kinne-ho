import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useMarketplace } from '../context/MarketplaceContext';
import { Heart, ArrowRight, Tag, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { MakeOfferModal } from '../components/offers/MakeOfferModal';
import type { ProductItem } from '../types/marketplace';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useMarketplace();

  const [activeOfferProduct, setActiveOfferProduct] = useState<ProductItem | null>(null);

  const favoriteProducts = MOCK_PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Saved Items</h1>
            <span className="bg-[#1b7a53]/10 text-[#1b7a53] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {favoriteProducts.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Keep track of items, negotiate directly, and make instant escrow purchases.
          </p>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">No saved items yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Tap the heart icon on any listing on the marketplace to save items here.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:scale-110 shadow-xs cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-gray-800 shadow-2xs">
                    {product.condition}
                  </span>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <Link to={`/product/${product.id}`} className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#1b7a53] transition-colors block line-clamp-1">
                    {product.title}
                  </Link>
                  <p className="text-sm font-extrabold text-gray-900">
                    Rs. {product.price.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-gray-400 block">{product.location} · {product.sellerName}</span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="p-3.5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveOfferProduct(product)}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Tag className="w-3 h-3 text-[#1b7a53]" />
                  <span>Offer</span>
                </button>
                <button
                  onClick={() => navigate(`/checkout/${product.id}`)}
                  className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Buy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offer Modal */}
      {activeOfferProduct && (
        <MakeOfferModal
          product={activeOfferProduct}
          isOpen={!!activeOfferProduct}
          onClose={() => setActiveOfferProduct(null)}
          onSubmitOffer={(amt) => {
            navigate(`/messages?seller=${encodeURIComponent(activeOfferProduct.sellerName)}&productId=${activeOfferProduct.id}`);
          }}
        />
      )}
    </div>
  );
};