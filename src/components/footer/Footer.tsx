import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Mission */}
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">Kinne Ho?</span>
              <span className="text-xs text-[#1b7a53] font-medium">किन्ने हो?</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Nepal's peer-to-peer marketplace for second-hand things. Reuse more. Waste less.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/explore?category=Clothing" className="hover:text-gray-900">Clothing</Link></li>
              <li><Link to="/explore?category=Furniture" className="hover:text-gray-900">Furniture</Link></li>
              <li><Link to="/explore?category=Gaming" className="hover:text-gray-900">Gaming</Link></li>
              <li><Link to="/explore?category=Electronics" className="hover:text-gray-900">Electronics</Link></li>
              <li><Link to="/explore?category=Books" className="hover:text-gray-900">Books</Link></li>
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/explore" className="hover:text-gray-900">Explore items</Link></li>
              <li><Link to="/sell" className="hover:text-gray-900">Sell something</Link></li>
              <li><Link to="/my-listings" className="hover:text-gray-900">My listings</Link></li>
              <li><Link to="/favorites" className="hover:text-gray-900">Favourites</Link></li>
              <li><Link to="/messages" className="hover:text-gray-900">Messages</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Support</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/how-it-works" className="hover:text-gray-900">How it works</Link></li>
              <li><Link to="/safety" className="hover:text-gray-900">Safety</Link></li>
              <li><Link to="/admin-demo" className="hover:text-gray-900">Admin (demo)</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <p>© 2026 Kinne Ho? — Made in Nepal</p>
          <p>Someone's unused item could be your next favourite thing.</p>
        </div>
      </div>
    </footer>
  );
};