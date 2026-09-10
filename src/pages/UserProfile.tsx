import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ProductCard } from '../components/marketplace/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeletons';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  ShoppingBag, 
  CheckCircle2, 
  UserCheck,
  Package
} from 'lucide-react';
import type { ProductItem } from '../types/marketplace';

export const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<'listings' | 'sold' | 'reviews'>('listings');
  const [listings, setListings] = useState<ProductItem[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const decodedName = decodeURIComponent(username || 'Seller');

  useEffect(() => {
    const fetchUserProfileAndListings = async () => {
      setIsLoading(true);

      try {
        // 1. Fetch Profile
        const nameParts = decodedName.split(' ');
        const firstName = nameParts[0] || '';

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .ilike('first_name', `%${firstName}%`)
          .limit(1)
          .single();

        if (profile) {
          setProfileData(profile);

          // 2. Fetch User's Listings
          const { data: userItems } = await supabase
            .from('listings')
            .select('*')
            .eq('seller_id', profile.id)
            .eq('status', 'active');

          if (userItems && userItems.length > 0) {
            const mapped: ProductItem[] = userItems.map((item: any) => ({
              id: item.id,
              title: item.title,
              price: Number(item.price),
              originalPrice: item.original_price ? Number(item.original_price) : undefined,
              condition: item.condition,
              category: item.category_id,
              location: item.location,
              sellerName: `${profile.first_name} ${profile.surname}`.trim(),
              sellerRating: profile.rating ? Number(profile.rating) : 5.0,
              image: item.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
              timeAgo: 'Recently',
              isVerified: true,
            }));
            setListings(mapped);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfileAndListings();
  }, [username]);

  const displayName = profileData 
    ? `${profileData.first_name} ${profileData.surname}`.trim()
    : decodedName;

  const displayLocation = profileData?.delivery_address || 'Kathmandu, Nepal';

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      
      {/* Profile Header Banner */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-[#1b7a53] flex items-center justify-center text-2xl font-extrabold shrink-0 shadow-xs border-2 border-emerald-200">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Seller
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 pt-0.5">
                <span className="flex items-center gap-1 font-extrabold text-gray-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  {profileData?.rating || '5.0'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {displayLocation}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Member since 2026
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f9f5] border border-[#d2efe2] rounded-2xl p-4 flex items-center gap-3 w-full sm:w-auto">
            <ShieldCheck className="w-5 h-5 text-[#1b7a53] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-gray-900 block">Nagarikta / ID Verified</span>
              <span className="text-gray-500 text-[11px]">Eligible for Escrow & Doorstep Delivery</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-t border-gray-100 pt-4">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-[#1b7a53] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sold'
                ? 'bg-[#1b7a53] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sold & Completed (0)
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#1b7a53] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Reviews (5)
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : activeTab === 'listings' ? (
          listings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center space-y-3 shadow-2xs">
              <Package className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No active items right now</h3>
              <p className="text-xs text-gray-500">This seller has no other active items at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {listings.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-2 text-xs text-gray-500">
            <p className="font-bold text-gray-900 text-sm">Seller Rating: 5.0 / 5.0 ⭐</p>
            <p>100% of buyers verified handover condition with zero escrow disputes.</p>
          </div>
        )}
      </div>

    </div>
  );
};