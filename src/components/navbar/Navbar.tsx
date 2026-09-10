import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, MessageSquare, User, Plus, Package, ShieldCheck, LogOut, LogIn, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Left: Brand + Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex flex-col cursor-pointer leading-tight">
            <span className="font-extrabold text-xl text-[#111827] tracking-tight">Kinne Ho?</span>
            <span className="text-[11px] text-[#1b7a53] font-medium">किन्ने हो?</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/explore" className="hover:text-gray-900 transition-colors">Explore</Link>
            <Link to="/explore" className="hover:text-gray-900 transition-colors">Categories</Link>
            <Link to="/sell" className="hover:text-gray-900 transition-colors">Sell</Link>
            <Link to="/safety" className="hover:text-gray-900 transition-colors">Safety</Link>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/explore?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                }
              }}
              className="w-full bg-gray-50/70 border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1b7a53] focus:border-[#1b7a53] transition-all"
            />
          </div>
        </div>

        {/* Right: Icons, Profile Dropdown & Sell Button */}
        <div className="flex items-center gap-4">
          <Link to="/favorites" className="text-gray-600 hover:text-gray-900 relative p-1 transition-colors" title="Saved items">
            <Heart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
          </Link>
          
          <Link to="/messages" className="text-gray-600 hover:text-gray-900 relative p-1 transition-colors" title="Messages & Offers">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
          </Link>

          {/* Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                  className="flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1b7a53] font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  <span>Safety Guide</span>
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
            <span>Sell</span>
          </button>
        </div>

      </div>
    </header>
  );
};