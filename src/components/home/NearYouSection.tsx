import React, { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../marketplace/ProductCard';
import { MOCK_PRODUCTS } from '../../data/mockData';

const NEPALI_CITIES = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Pokhara',
  'Chitwan',
  'Butwal'
];

export const NearYouSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>('Kathmandu');

  // Filter products by the selected city or Kathmandu Valley fallback
  const cityProducts = MOCK_PRODUCTS.filter(
    (product) => product.location.toLowerCase() === selectedCity.toLowerCase()
  );

  // If fewer than 4 items exist for this city, fill with remaining products
  const displayProducts = cityProducts.length >= 4 
    ? cityProducts.slice(0, 8) 
    : [...cityProducts, ...MOCK_PRODUCTS.filter(p => p.location.toLowerCase() !== selectedCity.toLowerCase())].slice(0, 8);

  return (
    <section className="space-y-5 py-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Popular Near You</h2>
            <div className="flex items-center gap-1 bg-[#1b7a53]/10 text-[#1b7a53] px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <MapPin className="w-3 h-3" />
              <span>{selectedCity}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Most viewed in {selectedCity} valley and nearby areas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* City Switcher Pill Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {NEPALI_CITIES.slice(0, 3).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#1b7a53] text-white shadow-2xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate(`/explore?location=${encodeURIComponent(selectedCity)}`)}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#1b7a53] hover:text-[#156343] transition-colors cursor-pointer group shrink-0"
          >
            <span>See all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 8-Card Grid matching your screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};