import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xl text-[#111827] tracking-tight">Kinne Ho?</span>
              <span className="text-xs text-[#1b7a53] font-medium">किन्ने हो? — Reuse more, waste less</span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Nepal's trusted peer-to-peer marketplace. Turn unused electronics, clothes, gaming gear, and books into cash safely and locally.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-[#1b7a53]" />
              <span>Full Escrow Protection & 48h Inspection Guarantee</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/explore?category=electronics" className="hover:text-[#1b7a53]">Electronics</Link></li>
              <li><Link to="/explore?category=clothing" className="hover:text-[#1b7a53]">Clothing</Link></li>
              <li><Link to="/explore?category=gaming" className="hover:text-[#1b7a53]">Gaming</Link></li>
              <li><Link to="/explore?category=furniture" className="hover:text-[#1b7a53]">Furniture</Link></li>
              <li><Link to="/explore?category=books" className="hover:text-[#1b7a53]">Books</Link></li>
            </ul>
          </div>

          {/* Marketplace */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/explore" className="hover:text-[#1b7a53]">Explore Items</Link></li>
              <li><Link to="/sell" className="hover:text-[#1b7a53]">Sell Something</Link></li>
              <li><Link to="/my-listings" className="hover:text-[#1b7a53]">My Listings</Link></li>
              <li><Link to="/favorites" className="hover:text-[#1b7a53]">Saved Items</Link></li>
              <li><Link to="/wallet" className="hover:text-[#1b7a53]">Wallet & Escrow</Link></li>
            </ul>
          </div>

          {/* Safety & Support */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider">Safety & Trust</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/safety" className="hover:text-[#1b7a53]">How Escrow Works</Link></li>
              <li><Link to="/safety" className="hover:text-[#1b7a53]">Handshake OTP PIN</Link></li>
              <li><Link to="/safety" className="hover:text-[#1b7a53]">Buyer Protection</Link></li>
              <li><Link to="/admin" className="hover:text-red-600 font-semibold">Dispute Arbiter</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Kinne Ho? Inc. All rights reserved across Nepal.</p>
          <p className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for the Nepali community</span>
          </p>
        </div>

      </div>
    </footer>
  );
};