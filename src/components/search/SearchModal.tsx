import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { supabase } from '../../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { Search, X, Tag, ArrowRight, Sparkles, MapPin } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useMarketplace();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isSearchOpen]);

  // Live search query against Supabase & fallback mock data
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data: dbItems } = await supabase
          .from('listings')
          .select('id, title, price, location, category_id, images')
          .ilike('title', `%${searchTerm.trim()}%`)
          .limit(4);

        if (dbItems && dbItems.length > 0) {
          setResults(dbItems);
        } else {
          // Fallback to local mock products matching search
          const matches = MOCK_PRODUCTS.filter((p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 4);
          setResults(matches);
        }
      } catch {
        const matches = MOCK_PRODUCTS.filter((p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 4);
        setResults(matches);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (id: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${id}`);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsSearchOpen(false);
    navigate(`/explore?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200/90 overflow-hidden relative">
        
        {/* Search Header Input */}
        <form onSubmit={handleFullSearch} className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search electronics, clothing, gaming, furniture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">
            ESC
          </kbd>
        </form>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-3">
          {searchTerm.trim() === '' ? (
            <div className="space-y-3 py-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block px-2">
                Popular Categories
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Electronics', icon: '📱', slug: 'electronics' },
                  { name: 'Clothing', icon: '👕', slug: 'clothing' },
                  { name: 'Gaming', icon: '🎮', slug: 'gaming' },
                  { name: 'Furniture', icon: '🛋️', slug: 'furniture' },
                  { name: 'Books', icon: '📚', slug: 'books' },
                ].map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(`/explore?category=${c.slug}`);
                    }}
                    className="flex items-center gap-2 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors cursor-pointer text-left"
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block px-2 mb-1">
                Matching Listings ({results.length})
              </span>
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item.id)}
                  className="p-3 rounded-2xl hover:bg-emerald-50/50 flex items-center justify-between cursor-pointer transition-colors border border-transparent hover:border-emerald-200 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80'}
                      alt={item.title}
                      className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#1b7a53] transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-[#1b7a53]">
                      Rs. {Number(item.price).toLocaleString()}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform ml-auto mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-1 text-xs text-gray-500">
              <p className="font-bold text-gray-900">No matching items found</p>
              <p>Press Enter to see all results in Explore items.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {searchTerm.trim() && (
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Hit Enter to view all results</span>
            <button
              onClick={handleFullSearch}
              className="bg-[#1b7a53] text-white px-3 py-1.5 rounded-xl font-bold hover:bg-[#156343] transition-colors cursor-pointer"
            >
              See All Items
            </button>
          </div>
        )}

      </div>
    </div>
  );
};