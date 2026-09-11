import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Camera, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  Mail, 
  Bell, 
  Heart, 
  LogOut, 
  User, 
  Wallet, 
  ShieldCheck 
} from 'lucide-react';
import { KINNE_HO_CATEGORIES } from '../../data/vintedCategories';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { favorites } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainTab, setActiveMainTab] = useState<string | null>(null);
  const [activeSubIndex, setActiveSubIndex] = useState<number>(0);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const catalogueRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setActiveMainTab(null);
      }
      if (catalogueRef.current && !catalogueRef.current.contains(e.target as Node)) {
        setIsCatalogueOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveMainTab(null);
    navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const currentCategory = KINNE_HO_CATEGORIES.find((c) => c.id === activeMainTab);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      
      {/* 1. Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="shrink-0 flex flex-col leading-tight cursor-pointer">
          <span className="font-black text-2xl text-[#111827] tracking-tight hover:opacity-90">
            Kinne <span className="text-[#1b7a53]">Ho?</span>
          </span>
          <span className="text-[11px] text-[#1b7a53] font-bold -mt-0.5">किन्ने हो?</span>
        </Link>

        {/* Search Bar with Catalogue dropdown & Camera photo icon */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl flex items-center bg-[#f3f4f6] hover:bg-[#eaecee] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1b7a53] rounded-xl transition-all">
          
          <div className="relative shrink-0" ref={catalogueRef}>
            <button
              type="button"
              onClick={() => setIsCatalogueOpen(!isCatalogueOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-gray-900 border-r border-gray-300/70 cursor-pointer"
            >
              <span>Catalogue</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isCatalogueOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCatalogueOpen && (
              <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50">
                {KINNE_HO_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setIsCatalogueOpen(false);
                      navigate(`/explore?category=${cat.id}`);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] cursor-pointer"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center flex-1 px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search for items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate('/sell')}
            title="Upload photo to sell"
            className="pr-3 pl-1 text-gray-400 hover:text-[#1b7a53] cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
        </form>

        {/* 2. Right CTA Actions: Pre-Login vs Post-Login */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!user ? (
            <>
              <Link
                to="/auth?mode=select"
                className="px-3.5 py-1.5 text-xs font-bold text-[#1b7a53] border border-[#1b7a53] rounded-xl hover:bg-[#1b7a53]/5 transition-colors cursor-pointer"
              >
                Sign up | Log in
              </Link>
              
              <Link
                to="/auth?mode=select&redirect=sell"
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#1b7a53] hover:bg-[#156343] rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Sell now
              </Link>

              <Link
                to="/how-it-works"
                className="text-gray-400 hover:text-gray-700 p-1"
                title="Help Center"
              >
                <HelpCircle className="w-5 h-5 stroke-[1.8]" />
              </Link>
            </>
          ) : (
            /* EXACT VINTED POST-LOGIN CONTROLS */
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Mail / Messages */}
              <Link 
                to="/messages" 
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative cursor-pointer"
                title="Messages"
              >
                <Mail className="w-5 h-5 stroke-[1.8]" />
              </Link>

              {/* Notifications with Badge */}
              <button
                type="button"
                onClick={() => navigate('/wallet')}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5 stroke-[1.8]" />
                <span className="absolute top-1.5 right-1.5 bg-[#e11d48] text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  1
                </span>
              </button>

              {/* Favorites / Wishlist */}
              <Link 
                to="/favorites" 
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative cursor-pointer" 
                title="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.8]" />
                {favorites.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1b7a53] rounded-full" />
                )}
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 pl-1 pr-1.5 py-1 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <img
                    src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt="User avatar"
                    className="w-7 h-7 rounded-full object-cover border border-gray-200"
                  />
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in duration-100">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-bold text-gray-900">{profile?.first_name} {profile?.surname}</p>
                      <p className="text-gray-400 text-[10px] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-[#1b7a53] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Balance: Rs. {Number(profile?.wallet_balance || 50000).toLocaleString()}
                      </span>
                    </div>

                    <Link to="/my-listings" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium">
                      My Profile & Wardrobe
                    </Link>
                    <Link to="/wallet" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium">
                      Kinne Ho? Balance & Orders
                    </Link>
                    <Link to="/safety" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium">
                      Safety & Escrow Help
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-semibold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sell Now Action Button */}
              <Link
                to="/sell"
                className="ml-1 px-4 py-2 text-xs font-bold text-white bg-[#1b7a53] hover:bg-[#156343] rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Sell now
              </Link>

              {/* Help Circle */}
              <Link
                to="/how-it-works"
                className="text-gray-400 hover:text-gray-700 p-1"
                title="Help Center"
              >
                <HelpCircle className="w-5 h-5 stroke-[1.8]" />
              </Link>

            </div>
          )}
        </div>

      </div>

      {/* 3. Category Tabs & Mega Menu */}
      <div className="border-t border-gray-100 bg-white relative" ref={megaMenuRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 overflow-x-auto text-xs font-semibold text-gray-600 scrollbar-none">
          {KINNE_HO_CATEGORIES.map((cat) => {
            const isActive = activeMainTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onMouseEnter={() => {
                  setActiveMainTab(cat.id);
                  setActiveSubIndex(0);
                }}
                onClick={() => {
                  setActiveMainTab(isActive ? null : cat.id);
                  setActiveSubIndex(0);
                }}
                className={`py-2.5 transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  isActive
                    ? 'border-[#1b7a53] text-[#1b7a53] font-bold'
                    : 'border-transparent hover:text-gray-900'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* 3-Column Mega Menu Flyout */}
        {activeMainTab && currentCategory && (
          <div 
            className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-xl z-50 animate-in fade-in duration-100"
            onMouseLeave={() => setActiveMainTab(null)}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-12 gap-8 text-xs min-h-[280px]">
              
              <div className="col-span-3 border-r border-gray-100 pr-4 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMainTab(null);
                    navigate(`/explore?category=${currentCategory.id}`);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-bold text-gray-900 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1b7a53]"></span>
                  <span>All {currentCategory.name}</span>
                </button>

                {currentCategory.subcategories.map((sub, idx) => (
                  <button
                    key={sub.name}
                    type="button"
                    onMouseEnter={() => setActiveSubIndex(idx)}
                    onClick={() => {
                      setActiveMainTab(null);
                      navigate(`/explore?category=${currentCategory.id}&sub=${encodeURIComponent(sub.name)}`);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      activeSubIndex === idx
                        ? 'bg-emerald-50 font-bold text-[#1b7a53]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{sub.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>

              <div className="col-span-9 grid grid-cols-2 gap-8 pl-4">
                {currentCategory.subcategories[activeSubIndex]?.groups.map((grp, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-1.5">
                      {grp.name}
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      {grp.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMainTab(null);
                              navigate(`/explore?category=${currentCategory.id}&item=${encodeURIComponent(item)}`);
                            }}
                            className="hover:text-[#1b7a53] hover:underline transition-colors text-left cursor-pointer"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>

    </header>
  );
};