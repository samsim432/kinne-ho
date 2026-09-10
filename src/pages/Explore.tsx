import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/marketplace/ProductCard';
import { SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Clothing', 'Furniture', 'Gaming', 'Electronics', 'Books'];
const CONDITIONS = ['All Conditions', 'Brand New', 'Like New', 'Good', 'Fair'];
const LOCATIONS = ['All Nepal', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara'];

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';

  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [selectedLocation, setSelectedLocation] = useState('All Nepal');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter((item) => {
    if (activeCategory !== 'All' && item.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
    if (selectedCondition !== 'All Conditions' && item.condition !== selectedCondition) return false;
    if (selectedLocation !== 'All Nepal' && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-6 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Explore Items</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Discover verified second-hand items across Nepal.
          </p>
        </div>

        {/* Mobile Filter & Sort Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block md:col-span-3 space-y-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
          
          {/* Category */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Category</h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat.toLowerCase() })}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#1b7a53]/10 text-[#1b7a53]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Condition</h3>
            <div className="space-y-1">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCondition === cond
                      ? 'bg-[#1b7a53]/10 text-[#1b7a53]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Location</h3>
            <div className="space-y-1">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedLocation === loc
                      ? 'bg-[#1b7a53]/10 text-[#1b7a53]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Grid & Empty States */}
        <div className="md:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center space-y-3 shadow-2xs">
              <Filter className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No matching items found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try resetting your filters or searching for another category.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setSelectedCondition('All Conditions');
                  setSelectedLocation('All Nepal');
                }}
                className="bg-[#1b7a53] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer inline-block"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs md:hidden">
          <div className="bg-white w-4/5 max-w-xs h-full p-5 space-y-6 overflow-y-auto ml-auto shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Category</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat.toLowerCase() })}
                      className={`text-xs py-1.5 px-2 rounded-lg border font-semibold ${
                        activeCategory.toLowerCase() === cat.toLowerCase()
                          ? 'border-[#1b7a53] bg-[#1b7a53]/10 text-[#1b7a53]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-[#1b7a53] text-white text-xs font-bold py-2.5 rounded-xl"
            >
              Apply Filters ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

    </div>
  );
};