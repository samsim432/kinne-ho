import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Plus, Eye, Heart, Tag } from 'lucide-react';

export const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'drafts'>('active');

  const myItems = [
    {
      id: '1',
      title: 'iPhone 13 128GB',
      condition: 'Good',
      price: 48000,
      originalPrice: 52000,
      discount: '-8%',
      views: 40,
      favorites: 3,
      offers: 0,
      listedAgo: '2 min ago',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: '4',
      title: 'Logitech MX Master 3 Mouse',
      condition: 'Like New',
      price: 7500,
      views: 358,
      favorites: 45,
      offers: 0,
      listedAgo: '1 day ago',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="py-2 max-w-xl mx-auto space-y-5">
      
      {/* Page Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My listings</h1>
        <p className="text-xs text-gray-500">Track views, favourites and offers.</p>
      </div>

      {/* New Listing Action Button */}
      <button
        onClick={() => navigate('/sell')}
        className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>New listing</span>
      </button>

      {/* Segmented Filter Pills */}
      <div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Active (8)
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'sold'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Sold (4)
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'drafts'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Drafts (2)
        </button>
      </div>

      {/* Listings Cards List */}
      <div className="space-y-3">
        {myItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200/90 rounded-3xl p-4 shadow-2xs space-y-3"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{item.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                    {item.condition}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm font-extrabold text-gray-900">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  {item.originalPrice && (
                    <span className="text-[11px] text-gray-400 line-through">
                      Rs. {item.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {item.discount && (
                    <span className="text-[10px] font-bold text-[#1b7a53] bg-emerald-50 px-1.5 py-0.2 rounded">
                      {item.discount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {item.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> {item.favorites} favourites
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> {item.offers} offers
                  </span>
                </div>

                <span className="text-[10px] text-gray-400 block">Listed {item.listedAgo}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <button
                onClick={() => navigate('/sell')}
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
              >
                Edit
              </button>
              <button
                onClick={() => navigate(`/product/${item.id}`)}
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};