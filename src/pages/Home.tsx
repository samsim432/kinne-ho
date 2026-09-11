import React, { useState, useEffect } from 'react';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { ProductCard } from '../components/marketplace/ProductCard';
import { supabase } from '../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../data/mockData';
import { X } from 'lucide-react';
import type { ProductItem } from '../types/marketplace';

export const Home: React.FC = () => {
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
            price: Number(item.price),
            condition: item.condition,
            category: item.category_id,
            location: item.location,
            sellerName: 'Verified Member',
            sellerRating: 5.0,
            image: item.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
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
    <div className="space-y-6 pb-12">
      
      {/* Vinted Pre-login Hero */}
      <HeroSlideshow />

      {/* Shipping Notice Banner */}
      {showShippingBanner && (
        <div className="bg-white border border-gray-200 rounded-lg p-3.5 flex items-center justify-between text-xs text-gray-600">
          <span>Shipping fees will be added at checkout</span>
          <button
            onClick={() => setShowShippingBanner(false)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Vinted Product Feed */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">Newsfeed</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {feedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};