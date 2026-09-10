import React from 'react';
import { Search, Heart, MessageSquare, User, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

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
            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
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

        {/* Right: Icons & Sell Action */}
        <div className="flex items-center gap-4">
          <Link to="/favorites" className="text-gray-600 hover:text-gray-900 relative p-1 transition-colors" title="Saved items">
            <Heart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
          </Link>
          
          <Link to="/messages" className="text-gray-600 hover:text-gray-900 relative p-1 transition-colors" title="Messages & Offers">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#1b7a53] rounded-full"></span>
          </Link>

          <Link to="/profile/Samir%20Simkhada" className="text-gray-600 hover:text-gray-900 p-1 transition-colors" title="Profile">
            <User className="w-5 h-5" />
          </Link>

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