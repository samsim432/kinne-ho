import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { ProductCard } from '../marketplace/ProductCard';
import { ProductCardSkeleton } from '../ui/Skeletons';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import type { ProductItem } from '../../types/marketplace';

const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara'];

export const NearYouSection: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Kathmandu');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearProducts = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            id,
            title,
            category_id,
            price,
            original_price,
            condition,
            location,
            images,
            created_at,
            seller:profiles(first_name, surname, rating)
          `)
          .eq('status', 'active')
          .ilike('location', `%${selectedCity}%`)
          .limit(8);

        if (!error && data && data.length > 0) {
          const mapped: ProductItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: Number(item.price),
            originalPrice: item.original_price ? Number(item.original_price) : undefined,
            condition: item.condition,
            category: item.category_id,
            location: item.location,
            sellerName: item.seller ? `${item.seller.first_name} ${item.seller.surname}`.trim() : 'Verified Seller',
            sellerRating: item.seller?.rating ? Number(item.seller.rating) : 5.0,
            image: item.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
            timeAgo: 'Recently',
            isVerified: true,
          }));
          setProducts(mapped);
        } else {
          // Fallback to local mock data matching location
          const fallback = MOCK_PRODUCTS.filter((p) =>
            p.location.toLowerCase().includes(selectedCity.toLowerCase())
          );
          setProducts(fallback.length > 0 ? fallback : MOCK_PRODUCTS.slice(0, 4));
        }
      } catch (err) {
        setProducts(MOCK_PRODUCTS.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchNearProducts();
  }, [selectedCity]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Popular Near You</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b7a53] bg-[#1b7a53]/10 px-2 py-0.5 rounded-full">
              <MapPin className="w-3 h-3" />
              {selectedCity}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Most viewed in {selectedCity} valley and nearby areas.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCity === city
                  ? 'bg-[#1b7a53] text-white shadow-2xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {city}
            </button>
          ))}
          <Link
            to="/explore"
            className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 ml-2 shrink-0"
          >
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </section>
  );
};