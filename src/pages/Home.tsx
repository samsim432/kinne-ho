import React, { useState, useEffect } from 'react';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { ProductCard } from '../components/marketplace/ProductCard';
import { supabase } from '../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import type { ProductItem } from '../types/marketplace';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [showShippingBanner, setShowShippingBanner] = useState(true);
  const [feedItems, setFeedItems] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const { data } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          const live: ProductItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            brand: item.specs?.brand || 'Authentic',
            price: Number(item.price),
            condition: item.condition,
            category: item.category_id,
            location: item.location,
            sellerName: item.seller_name || 'Verified Member',
            sellerRating: 5.0,
            image: item.images?.[0] || 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=400&q=80',
            timeAgo: 'Just now',
            isVerified: true,
          }));
          setFeedItems([...live, ...MOCK_PRODUCTS]);
        } else {
          setFeedItems(MOCK_PRODUCTS);
        }
      } catch {
        setFeedItems(MOCK_PRODUCTS);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="space-y-5 pb-16 pt-2">
      
      {/* 1. Only display the Hero Declutter Banner when user is NOT logged in */}
      {!user && <HeroSlideshow />}

      {/* 2. Vinted Shipping Notice Banner */}
      {showShippingBanner && (
        <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 flex items-center justify-between text-xs text-gray-600 shadow-2xs">
          <span>Shipping fees will be added at checkout</span>
          <button
            type="button"
            onClick={() => setShowShippingBanner(false)}
            className="text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Product Newsfeed Grid (5 Columns on Desktop matching Vinted) */}
      <div className="space-y-4">
        {user && (
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Newsfeed</h2>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {feedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};