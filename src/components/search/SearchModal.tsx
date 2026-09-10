import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { Search, X, TrendingUp, MapPin, Tag, ArrowRight } from 'lucide-react';

const TRENDING_TAGS = ['iPhone 13', 'Denim Jacket', 'PlayStation 5', 'Gaming Mouse', 'Sneakers', 'Books'];

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useMarketplace();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd + K or Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search items, categories, or locations in Nepal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                handleSelect(`/explore?q=${encodeURIComponent(query)}`);
              }
            }}
            className="w-full text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 hidden sm:inline">
            ESC
          </span>
        </div>

        {/* Dynamic Results */}
        <div className="p-3 max-h-96 overflow-y-auto">
          {query.trim() ? (
            filtered.length > 0 ? (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 block mb-1">
                  Matching Listings ({filtered.length})
                </span>
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(`/product/${item.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#1b7a53] transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location} • {item.condition}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#1b7a53]">Rs. {item.price.toLocaleString()}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-500">
                No results found for "{query}". Press enter to search all items.
              </div>
            )
          ) : (
            <div className="space-y-4 p-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-2">
                  <TrendingUp className="w-3 h-3" />
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSelect(`/explore?q=${encodeURIComponent(tag)}`)}
                      className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-[#1b7a53]/10 hover:text-[#1b7a53] text-xs font-medium text-gray-700 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-400 flex justify-between items-center">
          <span>Tip: Search by brand, city (e.g. Pokhara), or item name</span>
          <span className="font-semibold text-[#1b7a53]">Kinne Ho? Escrow Protected</span>
        </div>

      </div>
    </div>
  );
};