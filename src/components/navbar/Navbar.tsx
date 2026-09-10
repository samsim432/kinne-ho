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
  Tag,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';

const CATEGORIES = [
  { name: 'Clothing', icon: '👕', slug: 'clothing' },
  { name: 'Furniture', icon: '🛋️', slug: 'furniture' },
  { name: 'Gaming', icon: '🎮', slug: 'gaming' },
  { name: 'Electronics', icon: '📱', slug: 'electronics' },
  { name: 'Books', icon: '📚', slug: 'books' },
];

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Counter Offer: Rs. 46,000',
    desc: 'Samir Simkhada countered your offer on iPhone 13.',
    time: '10m ago',
    link: '/messages',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Price Drop Alert (-15%)',
    desc: 'An item in your saved wishlist dropped in price.',
    time: '1h ago',
    link: '/favorites',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Order Status Update',
    desc: 'Order #KH-1902 is ready for in-person Handshake OTP verification.',
    time: '3h ago',
    link: '/order/order-demo?productId=1&fulfillment=pickup',
    unread: false,
  },
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { setIsSearchOpen, favorites } = useMarketplace();
  const { language, setLanguage, t } = useLanguage();
  
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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
    navigate(`/explore?category=${slug}`);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Left: Brand + Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="flex flex-col cursor-pointer leading-tight">
            <span className="font-extrabold text-xl text-[#111827] tracking-tight">Kinne Ho?</span>
            <span className="text-[11px] text-[#1b7a53] font-medium">किन्ने हो?</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/explore" className="hover:text-gray-900 transition-colors">
              {t.explore}
            </Link>

            {/* Categories Dropdown */}
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

        {/* Center: Search Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
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

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          
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

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
                setIsCategoriesOpen(false);
              }}
              className="text-gray-600 hover:text-gray-900 relative p-1 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-gray-900">Notifications</span>
                  <span className="text-[10px] text-[#1b7a53] font-bold">2 Unread</span>
                </div>

                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <Link
                      key={n.id}
                      to={n.link}
                      onClick={() => setIsNotifOpen(false)}
                      className="p-3 hover:bg-gray-50 flex items-start gap-2.5 transition-colors block"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-[#1b7a53]' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-gray-900 text-xs truncate">{n.title}</h4>
                          <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{n.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/favorites" className="text-gray-600 hover:text-gray-900 relative p-1 transition-colors" title={t.savedItems}>
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
            )}
          </Link>
          
          <Link to="/messages" className="text-gray-600 hover:text-gray-900 relative p-1 transition-colors" title={t.messages}>
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
          </Link>

          {/* Account Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsCategoriesOpen(false);
                setIsNotifOpen(false);
              }}
              className="text-gray-600 hover:text-gray-900 p-1 transition-colors cursor-pointer flex items-center"
              title="Account Menu"
            >
              <User className="w-5 h-5" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2 border-b border-gray-100">
                  <p className="font-bold text-gray-900">Samir Simkhada</p>
                  <p className="text-gray-500 text-[11px] truncate">samir@example.com</p>
                </div>

                <Link
                  to="/profile/Samir%20Simkhada"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] font-medium"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Public Profile</span>
                </Link>

                <Link
                  to="/wallet"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] font-medium"
                >
                  <Wallet className="w-4 h-4 text-gray-400" />
                  <span>Wallet & Escrow</span>
                </Link>

                <Link
                  to="/my-listings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] font-medium"
                >
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>My Listings</span>
                </Link>

                <Link
                  to="/safety"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  <span>{t.safety}</span>
                </Link>

                <div className="border-t border-gray-100 my-1"></div>

                <Link
                  to="/auth"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <LogIn className="w-4 h-4 text-gray-400" />
                  <span>Switch / Sign In</span>
                </Link>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/auth');
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
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

      </div>
    </header>
  );
};