import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/marketplace/ProductCard';
import { MakeOfferModal } from '../components/offers/MakeOfferModal';
import { 
  Heart, 
  Share2, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
  const similarProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="space-y-12 py-4">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Images */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 right-4 px-3 py-1 rounded-md text-xs font-semibold bg-white/90 backdrop-blur-xs text-gray-800 shadow-xs border border-gray-100">
              {product.condition}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[product.image, product.image, product.image].map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Actions & Info Box */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header & Pricing */}
          <div className="space-y-2 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1b7a53] bg-[#1b7a53]/10 px-2.5 py-0.5 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFav(!isFav)}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                  title="Favorite"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-extrabold text-gray-900">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {product.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Listed {product.timeAgo}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => setIsOfferOpen(true)}
              className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-sm"
            >
              Make Offer
            </button>
            
            <button
              onClick={() => alert(`Chat with ${product.sellerName} will open on Day 5!`)}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Seller</span>
            </button>
          </div>

          {/* Structured Condition & Verification Checklist */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Item Condition Disclosure</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1b7a53]" />
                <span>Original item verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1b7a53]" />
                <span>No major defects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1b7a53]" />
                <span>In-person inspection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Minor normal wear</span>
              </div>
            </div>
          </div>

          {/* Seller Reputation Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#1b7a53] text-white font-bold flex items-center justify-center text-base">
                {product.sellerName[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{product.sellerName}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span className="font-semibold text-gray-800">{product.sellerRating}</span>
                  <span>• 32 completed sales</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#1b7a53] bg-[#1b7a53]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>

        </div>

      </div>

      {/* Similar Items in Same Category */}
      {similarProducts.length > 0 && (
        <section className="space-y-4 pt-10 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Similar items in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onClick={() => {
                  navigate(`/product/${item.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Offer Modal */}
      <MakeOfferModal
        product={product}
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
        onSubmitOffer={(amount) => {
          console.log('Offer submitted:', amount);
        }}
      />

    </div>
  );
};