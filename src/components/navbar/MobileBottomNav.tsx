import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, MessageSquare, Heart } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const MobileBottomNav: React.FC = () => {
  const { favorites } = useMarketplace();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/sell', label: 'Sell', icon: PlusCircle, isPrimary: true },
    { to: '/messages', label: 'Inbox', icon: MessageSquare },
    { to: '/favorites', label: 'Saved', icon: Heart, badge: favorites.length },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  item.isPrimary
                    ? 'text-[#1b7a53] -mt-4 bg-emerald-50 border-2 border-[#1b7a53] p-2 shadow-md rounded-full'
                    : isActive
                    ? 'text-[#1b7a53] font-extrabold'
                    : 'text-gray-500 hover:text-gray-900 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`${item.isPrimary ? 'w-6 h-6' : 'w-5 h-5'} ${isActive && !item.isPrimary ? 'stroke-[2.5]' : ''}`} />
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {!item.isPrimary && (
                    <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};