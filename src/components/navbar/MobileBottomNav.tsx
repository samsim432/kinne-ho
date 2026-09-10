import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const MobileBottomNav: React.FC = () => {
  const { favorites } = useMarketplace();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-items-center">
        
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#1b7a53] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        {/* Explore */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#1b7a53] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Explore</span>
        </NavLink>

        {/* Sell Center Button */}
        <NavLink
          to="/sell"
          className="flex flex-col items-center py-0.5 text-[10px] font-bold text-[#1b7a53]"
        >
          <div className="w-9 h-9 rounded-full bg-[#1b7a53] text-white flex items-center justify-center shadow-md">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="mt-0.5">Sell</span>
        </NavLink>

        {/* Messages */}
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 text-[10px] font-medium relative transition-colors ${
              isActive ? 'text-[#1b7a53] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#1b7a53]"></span>
          <span>Messages</span>
        </NavLink>

        {/* Profile / Wallet */}
        <NavLink
          to="/profile/Samir%20Simkhada"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#1b7a53] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </NavLink>

      </div>
    </nav>
  );
};