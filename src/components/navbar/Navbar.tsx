import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  MessageSquare, 
  User, 
  Plus, 
  Package, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Wallet, 
  ChevronDown, 
  Bell,
  Menu,
  X,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { EditProfileModal } from '../profile/EditProfileModal';

const CATEGORIES = [
  { name: 'Clothing', icon: '👕', slug: 'clothing' },
  { name: 'Furniture', icon: '🛋️', slug: 'furniture' },
  { name: 'Gaming', icon: '🎮', slug: 'gaming' },
  { name: 'Electronics', icon: '📱', slug: 'electronics' },
  { name: 'Books', icon: '📚', slug: 'books' },
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { setIsSearchOpen, favorites, showToast } = useMarketplace();
  const { language, setLanguage, t } = useLanguage();
  
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (slug: string) => {
    setIsCategoriesOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/explore?category=${slug}`);
  };

  const handleMobileNav = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    await signOut();
    showToast('Signed Out', 'You have been signed out safely.', 'info');
    navigate('/');
  };

  // Real display names from Supabase
  const displayName = profile 
    ? `${profile.first_name} ${profile.surname}`.trim() || 'Kinne Ho User'
    : user?.email?.split('@')[0] || 'Guest User';
  const displayEmail = profile?.email || user?.email || 'No email attached';

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8 shrink-0">
            <Link to="/" className="flex flex-col cursor-pointer leading-tight">
              <span className="font-extrabold text-xl text-[#111827] tracking-tight">Kinne Ho?</span>
              <span className="text-[11px] text-[#1b7a53] font-medium">किन्ने हो?</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to="/explore" className="hover:text-gray-900 transition-colors">
                {t.explore}
              </Link>

              <div className="relative" ref={categoriesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoriesOpen(!isCategoriesOpen);
                    setIsProfileOpen(false);
                    setIsNotifOpen(false);
                  }}
                  className={`flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer ${
                    isCategoriesOpen ? 'text-gray-900 font-semibold' : ''
                  }`}
                >
                  <span>{t.categories}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute left-0 mt-3 w-48 bg-white border border-gray-200/90 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleCategorySelect(cat.slug)}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-gray-800 hover:bg-gray-50 hover:text-[#1b7a53] transition-colors cursor-pointer font-medium"
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/sell" className="hover:text-gray-900 transition-colors">
                {t.sell}
              </Link>
              <Link to="/safety" className="hover:text-gray-900 transition-colors">
                {t.safety}
              </Link>
            </nav>
          </div>

          {/* Center: Command Palette / Search Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm text-gray-400 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span>{t.searchPlaceholder}</span>
              </div>
              <kbd className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-white">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'en' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('np')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'np' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                नेपाली
              </button>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                  setIsCategoriesOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 relative p-1.5 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Notifications</span>
                    <span className="text-[10px] text-[#1b7a53] font-bold">2 Unread</span>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    <Link
                      to="/messages"
                      onClick={() => setIsNotifOpen(false)}
                      className="p-3 hover:bg-gray-50 flex items-start gap-2.5 transition-colors block"
                    >
                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#1b7a53]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-gray-900 text-xs truncate">Counter Offer: Rs. 46,000</h4>
                          <span className="text-[10px] text-gray-400 shrink-0">10m ago</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">Counter offer received on your listing.</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/favorites" className="text-gray-600 hover:text-gray-900 relative p-1.5 transition-colors" title={t.savedItems}>
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
              )}
            </Link>
            
            <Link to="/messages" className="text-gray-600 hover:text-gray-900 relative p-1.5 transition-colors" title={t.messages}>
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
            </Link>

            {/* Profile Dropdown Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsCategoriesOpen(false);
                  setIsNotifOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 p-1.5 transition-colors cursor-pointer flex items-center"
                title="Account Menu"
              >
                <User className="w-5 h-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  
                  {/* Real Dynamic Name & Email from Supabase */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="font-bold text-gray-900 text-sm truncate">{displayName}</p>
                    <p className="text-gray-500 text-[11px] truncate mt-0.5">{displayEmail}</p>
                    {profile && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-[#1b7a53] bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                        Balance: Rs. {Number(profile.wallet_balance || 0).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsEditProfileOpen(true);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] font-medium cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>Edit Profile</span>
                      </button>

                      <Link
                        to={`/profile/${encodeURIComponent(displayName)}`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] font-medium"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Public Profile</span>
                      </Link>

                      <Link
                        to="/wallet"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] font-medium"
                      >
                        <Wallet className="w-4 h-4 text-gray-400" />
                        <span>Wallet & Escrow</span>
                      </Link>

                      <Link
                        to="/my-listings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] font-medium"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>My Listings</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-red-700 hover:bg-red-50 font-bold"
                      >
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                        <span>Admin Moderation</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-2">
                      <Link
                        to="/auth"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center justify-center gap-2 bg-[#1b7a53] hover:bg-[#156343] text-white font-bold py-2 rounded-xl transition-colors text-xs"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In / Create Account</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/sell')}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white text-sm font-medium px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.sell}</span>
            </button>
          </div>

          {/* Right: Mobile Controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-700 p-1 cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/favorites" className="text-gray-700 relative p-1 cursor-pointer" title="Saved">
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-800 p-1 cursor-pointer"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs md:hidden">
          <div className="bg-white w-4/5 max-w-sm h-full flex flex-col justify-between ml-auto shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex flex-col leading-tight">
                  <span className="font-extrabold text-xl text-[#111827]">
                    Kinne <span className="text-[#1b7a53]">Ho?</span>
                  </span>
                  <span className="text-xs text-gray-400 font-medium">किन्ने हो?</span>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Bar in Mobile Drawer */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <p className="font-bold text-gray-900 text-xs truncate">{displayName}</p>
                <p className="text-gray-500 text-[10px] truncate">{displayEmail}</p>
              </div>

              <div className="p-4 space-y-1 text-sm font-semibold text-gray-800">
                {user && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsEditProfileOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-[#1b7a53] font-bold"
                  >
                    Edit Profile
                  </button>
                )}

                <button
                  onClick={() => handleMobileNav('/explore')}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Explore
                </button>

                <button
                  onClick={() => handleMobileNav('/sell')}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-gray-100/80 font-bold text-gray-900 transition-colors cursor-pointer"
                >
                  Sell something
                </button>

                <button
                  onClick={() => handleMobileNav('/messages')}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Messages
                </button>

                <button
                  onClick={() => handleMobileNav('/favorites')}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Favourites
                </button>

                <button
                  onClick={() => handleMobileNav('/my-listings')}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  My listings
                </button>

                <button
                  onClick={() => handleMobileNav('/safety')}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Safety
                </button>

                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    onClick={() => handleMobileNav('/auth')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-[#1b7a53] font-bold hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Language / भाषा</span>
              <div className="flex bg-gray-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    language === 'en' ? 'bg-white text-gray-900 shadow-2xs font-extrabold' : ''
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('np')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    language === 'np' ? 'bg-white text-gray-900 shadow-2xs font-extrabold' : ''
                  }`}
                >
                  नेपाली
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Edit Profile Modal Trigger */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </>
  );
};