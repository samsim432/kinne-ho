import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/marketplace/ProductCard';
import { CategoryType, ConditionType } from '../types/marketplace';

const CATEGORIES: CategoryType[] = ['Clothing', 'Furniture', 'Gaming', 'Electronics', 'Books'];
const CONDITIONS: ConditionType[] = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const LOCATIONS = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal'];

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const [selectedConditions, setSelectedConditions] = useState<ConditionType[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const handleCategoryChange = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const toggleCondition = (condition: ConditionType) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const handleReset = () => {
    setSelectedConditions([]);
    setSelectedLocations([]);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // Search Query Filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // Condition Filter
      if (selectedConditions.length > 0 && !selectedConditions.includes(item.condition)) return false;

      // Location Filter
      if (selectedLocations.length > 0 && !selectedLocations.includes(item.location)) return false;

      // Price Filters
      if (minPrice && item.price < parseInt(minPrice, 10)) return false;
      if (maxPrice && item.price > parseInt(maxPrice, 10)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, searchQuery, selectedConditions, selectedLocations, minPrice, maxPrice, sortBy]);

  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore the marketplace</h1>
        <p className="text-sm text-gray-500 mt-1">Everything listed by people across Nepal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Filters</h3>
            <button
              onClick={handleReset}
              className="text-xs text-[#1b7a53] hover:underline font-medium cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Category</label>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange('All')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-[#1b7a53]/10 text-[#1b7a53] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1b7a53]/10 text-[#1b7a53] font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Price (Rs.)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
              <span className="text-gray-400 text-xs">—</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53]"
              />
            </div>
          </div>

          {/* Condition Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Condition</label>
            <div className="space-y-1.5">
              {CONDITIONS.map((cond) => (
                <label key={cond} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(cond)}
                    onChange={() => toggleCondition(cond)}
                    className="rounded border-gray-300 text-[#1b7a53] focus:ring-[#1b7a53]"
                  />
                  <span>{cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Location</label>
            <div className="space-y-1.5">
              {LOCATIONS.map((loc) => (
                <label key={loc} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleLocation(loc)}
                    className="rounded border-gray-300 text-[#1b7a53] focus:ring-[#1b7a53]"
                  />
                  <span>{loc}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Product Grid Area */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-gray-500 font-medium">
              {filteredProducts.length} items
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1b7a53]"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-gray-800">No items match your filters</p>
              <p className="text-xs text-gray-500">Try adjusting your category, price range, or location filters.</p>
              <button
                onClick={handleReset}
                className="bg-[#1b7a53] text-white text-xs font-medium px-4 py-2 rounded-lg"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};