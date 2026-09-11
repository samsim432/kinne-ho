import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { MakeOfferModal } from '../components/offers/MakeOfferModal';
import { ReportModal } from '../components/marketplace/ReportModal';
import { 
  ShieldCheck, 
  MapPin, 
  Tag, 
  Heart, 
  Share2, 
  Flag, 
  ArrowLeft,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
  MessageSquare
} from 'lucide-react';
import type { ProductItem } from '../types/marketplace';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, showToast } = useMarketplace();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const { data: dbItem, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && dbItem) {
          setProduct({
            id: dbItem.id,
            title: dbItem.title,
            price: Number(dbItem.price),
            originalPrice: dbItem.original_price ? Number(dbItem.original_price) : undefined,
            condition: dbItem.condition,
            category: dbItem.category_id,
            location: dbItem.location,
            sellerName: dbItem.seller_name || 'Verified Member',
            sellerRating: 4.9,
            image: dbItem.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
            timeAgo: 'Recently',
            isVerified: true,
          });
        } else {
          const fallback = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
          setProduct(fallback);
        }
      } catch {
        setProduct(MOCK_PRODUCTS[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="py-20 text-center space-y-2">
        <p className="text-xs font-bold text-gray-400">Loading listing details...</p>
      </div>
    );
  }

  const images = [
    product.image,
    'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'
  ];

  const escrowProtectionFee = Math.round(product.price * 0.03);
  const totalPrice = product.price + escrowProtectionFee;

  // STRICT AUTH GUARDS
  const handleBuyNow = () => {
    if (!user) {
      showToast('Sign in to purchase', 'Please sign in or create an account to buy with Escrow protection.', 'info');
      navigate(`/auth?mode=select&redirect=checkout&productId=${product.id}`);
      return;
    }
    navigate(`/checkout/${product.id}`);
  };

  const handleMakeOffer = () => {
    if (!user) {
      showToast('Sign in to make an offer', 'Please sign in or create an account to negotiate prices.', 'info');
      navigate(`/auth?mode=select&redirect=product&productId=${product.id}`);
      return;
    }
    setIsOfferModalOpen(true);
  };

  return (
    <div className="py-4 max-w-6xl mx-auto space-y-6">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Gallery Column */}
        <div className="md:col-span-7 space-y-3">
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200/80 relative shadow-2xs">
            <img
              src={images[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md text-gray-700 hover:text-red-500 cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          <div className="flex gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  activeImageIndex === idx ? 'border-[#1b7a53] ring-2 ring-emerald-200' : 'border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Info Column */}
        <div className="md:col-span-5 space-y-5">
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-card space-y-4">
            
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-[#1b7a53] px-2.5 py-0.5 rounded-full border border-emerald-200">
                {product.condition}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{product.title}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{product.location}</span>
              </p>
            </div>

            <div className="border-t border-b border-gray-100 py-3 space-y-0.5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-gray-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <span>Rs. {totalPrice.toLocaleString()} incl. Escrow & Handshake Protection</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#1b7a53]" />
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-[#1b7a53] hover:bg-[#156343] text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-md cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Buy with Escrow</span>
              </button>

              <button
                type="button"
                onClick={handleMakeOffer}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold py-3 rounded-2xl transition-all shadow-2xs cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <Tag className="w-4 h-4 text-[#1b7a53]" />
                <span>Make an Offer</span>
              </button>
            </div>

            {/* Seller profile snippet */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#1b7a53] font-bold text-xs flex items-center justify-center">
                  {product.sellerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{product.sellerName}</h4>
                  <span className="text-[10px] text-gray-400">Verified Seller ★ {product.sellerRating}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                title="Report Listing"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      <MakeOfferModal
        product={product}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSubmitOffer={(amount) => {
          navigate(`/messages?seller=${encodeURIComponent(product.sellerName)}&productId=${product.id}&offer=${amount}`);
        }}
      />

      <ReportModal
        product={product}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
};