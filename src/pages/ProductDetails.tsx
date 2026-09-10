import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/marketplace/ProductCard';
import { MakeOfferModal } from '../components/offers/MakeOfferModal';
import { ReportModal } from '../components/marketplace/ReportModal';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Heart, 
  Eye, 
  MapPin, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Flag, 
  ArrowRight,
  Maximize2,
  X,
  Sparkles
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMarketplace();

  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
  const favorited = isFavorite(product.id);

  const similarProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const [hasOffer, setHasOffer] = useState(true);
  const [userOffer, setUserOffer] = useState(44000);
  const [sellerCounter, setSellerCounter] = useState(46000);

  return (
    <div className="space-y-12 py-4 max-w-7xl mx-auto">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/explore" className="hover:text-gray-900">Explore</Link>
        <span>/</span>
        <Link to={`/explore?category=${product.category}`} className="hover:text-gray-900 lowercase">
          {product.category}
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Photos */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            onClick={() => setLightboxImg(product.image)}
            className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 cursor-zoom-in group"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Click to enlarge</span>
            </div>
          </div>

          <div className="flex gap-3">
            {[product.image, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80'].map((img, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImg(img)}
                className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details & Actions */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {product.title}
              </h1>
              <button
                onClick={() => toggleFavorite(product.id)}
                className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                title="Save"
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-[#1b7a53]">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 pt-1">
              <span className="bg-[#1b7a53]/10 text-[#1b7a53] px-2 py-0.5 rounded font-medium">
                {product.condition}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {product.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                40 views
              </span>
              <span>•</span>
              <span>Listed {product.timeAgo}</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-900">
              <span className="flex items-center gap-1 text-[#1b7a53]">
                <Sparkles className="w-3.5 h-3.5" />
                Kinne Ho? Fair Price Meter
              </span>
              <span className="text-[#1b7a53]">Great Deal</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Similar {product.title.split(' ')[0]}s sell between <strong>Rs. {Math.round(product.price * 0.95).toLocaleString()}</strong> – <strong>Rs. {Math.round(product.price * 1.1).toLocaleString()}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setIsOfferOpen(true)}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm shadow-2xs text-center"
            >
              Make Offer
            </button>
            <button
              onClick={() => navigate(`/checkout/${product.id}`)}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm shadow-2xs text-center"
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={() => navigate(`/messages?seller=${encodeURIComponent(product.sellerName)}&productId=${product.id}`)}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900 py-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Message Seller</span>
          </button>

          {hasOffer && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Your negotiation</span>
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                  Counter offer
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-0.5">
                <p>You offered <strong>Rs. {userOffer.toLocaleString()}</strong></p>
                <p>Seller countered <strong>Rs. {sellerCounter.toLocaleString()}</strong></p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => navigate(`/checkout/${product.id}`)}
                  className="bg-[#1b7a53] text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-[#156343] transition-colors cursor-pointer"
                >
                  Accept & Pay Escrow
                </button>
                <button
                  onClick={() => setIsOfferOpen(true)}
                  className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Counter
                </button>
              </div>
            </div>
          )}

          {/* Seller Card */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Seller</span>
            <div 
              onClick={() => navigate(`/profile/${encodeURIComponent(product.sellerName)}`)}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:border-gray-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#1b7a53] font-bold flex items-center justify-center text-sm">
                  {product.sellerName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1b7a53] transition-colors">
                      {product.sellerName}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      {product.sellerRating}
                    </span>
                    <span>•</span>
                    <span>32 sales</span>
                    <span>•</span>
                    <span>{product.location}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:text-gray-700 transition-all" />
            </div>
          </div>

          <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-4 space-y-1.5 text-xs text-gray-700">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              <ShieldCheck className="w-4 h-4 text-[#1b7a53]" />
              <span>Kinne Ho? Escrow Protection</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Never pay advance cash to strangers. Your money stays locked until you receive the item and verify its condition.
            </p>
          </div>

          {/* Functional Report Trigger */}
          <button 
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors cursor-pointer pt-1"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report listing</span>
          </button>

        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-gray-200">
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Item details</h3>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
            <div className="grid grid-cols-2 p-3">
              <span className="text-gray-500 font-medium">Brand</span>
              <span className="text-gray-900 font-semibold">Apple</span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-gray-500 font-medium">Model</span>
              <span className="text-gray-900 font-semibold">iPhone 13</span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-gray-500 font-medium">Condition</span>
              <span className="text-gray-900 font-semibold">{product.condition}</span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-gray-500 font-medium">Warranty</span>
              <span className="text-gray-900 font-semibold">Expired</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Description</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-white border border-gray-200 rounded-xl p-4">
            Used for about two years as daily phone. Screen is scratchless with screen protector applied since day 1. Battery still comfortably lasts a full day.
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImg}
            alt="Enlarged view"
            className="max-w-4xl max-h-[85vh] w-auto h-auto rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Make Offer Modal */}
      <MakeOfferModal
        product={product}
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
        onSubmitOffer={(amount) => {
          setUserOffer(amount);
          setHasOffer(true);
        }}
      />

      {/* Report Modal */}
      <ReportModal
        product={product}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

    </div>
  );
};