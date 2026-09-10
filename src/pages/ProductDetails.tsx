import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../data/mockData';
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
  Sparkles,
  Loader2
} from 'lucide-react';
import type { ProductItem } from '../types/marketplace';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMarketplace();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [itemImages, setItemImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState<Record<string, any>>({});
  const [defectsList, setDefectsList] = useState<string[]>([]);

  useEffect(() => {
    const fetchExactProduct = async () => {
      if (!id) return;
      setLoading(true);

      try {
        // 1. Check if ID exists in Supabase listings
        const { data: dbItem, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && dbItem) {
          // Fetch the seller profile for this item
          let sellerName = 'Verified Seller';
          let sellerRating = 5.0;

          if (dbItem.seller_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, surname, rating')
              .eq('id', dbItem.seller_id)
              .maybeSingle();

            if (profile) {
              sellerName = `${profile.first_name || ''} ${profile.surname || ''}`.trim() || 'Verified Seller';
              sellerRating = profile.rating ? Number(profile.rating) : 5.0;
            }
          }

          const mapped: ProductItem = {
            id: dbItem.id,
            title: dbItem.title,
            price: Number(dbItem.price),
            originalPrice: dbItem.original_price ? Number(dbItem.original_price) : undefined,
            condition: dbItem.condition,
            category: dbItem.category_id || 'Electronics',
            location: dbItem.location,
            sellerName,
            sellerRating,
            image: dbItem.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
            timeAgo: 'Recently listed',
            isVerified: true,
          };

          setProduct(mapped);
          setItemImages(dbItem.images && dbItem.images.length > 0 ? dbItem.images : [mapped.image]);
          setDescription(dbItem.description || 'No description provided by seller.');
          setSpecs(dbItem.specifications || {});
          setDefectsList(dbItem.defects || []);
        } else {
          // 2. Fallback to mock item if it's one of the demo IDs (e.g., '1', '2')
          const mockMatch = MOCK_PRODUCTS.find((p) => p.id === id);
          if (mockMatch) {
            setProduct(mockMatch);
            setItemImages([mockMatch.image]);
            setDescription('Pre-owned item verified for physical condition.');
          } else {
            // Default first mock if completely unknown
            setProduct(MOCK_PRODUCTS[0]);
            setItemImages([MOCK_PRODUCTS[0].image]);
            setDescription('Demo marketplace listing.');
          }
        }
      } catch (err) {
        console.error('Error fetching PDP:', err);
        setProduct(MOCK_PRODUCTS[0]);
        setItemImages([MOCK_PRODUCTS[0].image]);
      } finally {
        setLoading(false);
      }
    };

    fetchExactProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#1b7a53] animate-spin" />
        <p className="text-xs font-bold text-gray-500">Loading item details...</p>
      </div>
    );
  }

  if (!product) return null;

  const favorited = isFavorite(product.id);
  const currentImage = itemImages[activeImageIndex] || product.image;

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto pb-24 md:pb-12">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/explore" className="hover:text-gray-900 font-medium">Explore</Link>
        <span>/</span>
        <Link to={`/explore?category=${product.category.toLowerCase()}`} className="hover:text-gray-900 lowercase font-medium">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left: Photos */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            onClick={() => setLightboxImg(currentImage)}
            className="relative aspect-4/3 rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 cursor-zoom-in group shadow-2xs"
          >
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Click to enlarge</span>
            </div>
          </div>

          {/* Thumbnails */}
          {itemImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {itemImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-gray-50 cursor-pointer transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#1b7a53] shadow-xs' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase Controls */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {product.title}
              </h1>
              <button
                onClick={() => toggleFavorite(product.id)}
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
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
              <span className="bg-[#1b7a53]/10 text-[#1b7a53] px-2.5 py-0.5 rounded-full font-bold">
                {product.condition}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {product.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-400">
                <Eye className="w-3.5 h-3.5" />
                Live in Database
              </span>
              <span>•</span>
              <span className="text-gray-400">{product.timeAgo}</span>
            </div>
          </div>

          {/* Fair Price Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-gray-900">
              <span className="flex items-center gap-1 text-[#1b7a53]">
                <Sparkles className="w-3.5 h-3.5" />
                Kinne Ho? Fair Price Meter
              </span>
              <span className="text-[#1b7a53] font-bold">Live Verified</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Escrow funds remain protected until you inspect the item and give the Handshake PIN.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setIsOfferOpen(true)}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-xs text-center"
            >
              Make Offer
            </button>
            <button
              onClick={() => navigate(`/checkout/${product.id}`)}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-2xs text-center"
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
                    <span className="flex items-center gap-0.5 font-bold text-gray-900">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      {product.sellerRating}
                    </span>
                    <span>•</span>
                    <span>Verified Seller</span>
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
              Never pay advance cash. The seller cannot claim payment until you verify the item.
            </p>
          </div>

          <button 
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors cursor-pointer pt-1"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report listing</span>
          </button>

        </div>
      </div>

      {/* Structured Specifications & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-gray-200">
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Item Specifications</h3>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
            <div className="grid grid-cols-2 p-3">
              <span className="text-gray-500 font-medium">Category</span>
              <span className="text-gray-900 font-semibold capitalize">{product.category}</span>
            </div>
            <div className="grid grid-cols-2 p-3">
              <span className="text-gray-500 font-medium">Condition</span>
              <span className="text-gray-900 font-semibold">{product.condition}</span>
            </div>
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="grid grid-cols-2 p-3">
                <span className="text-gray-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-gray-900 font-semibold">{String(val)}</span>
              </div>
            ))}
          </div>

          {defectsList.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-amber-900 block">Disclosed Wear / Defects:</span>
              <div className="flex flex-wrap gap-1.5">
                {defectsList.map((d, i) => (
                  <span key={i} className="text-[11px] font-semibold bg-white border border-amber-300 text-amber-800 px-2.5 py-0.5 rounded-lg">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Seller Description</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs whitespace-pre-line">
            {description}
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

      {/* Offer Modal */}
      <MakeOfferModal
        product={product}
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
        onSubmitOffer={() => {
          navigate(`/messages?seller=${encodeURIComponent(product.sellerName)}&productId=${product.id}`);
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