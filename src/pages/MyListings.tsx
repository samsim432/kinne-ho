import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import type { ProductItem } from '../types/marketplace';
import { 
  Plus, 
  Eye, 
  CheckCircle2, 
  Trash2, 
  Tag, 
  ArrowUpRight,
  Package
} from 'lucide-react';

interface ManagedListing extends ProductItem {
  views: number;
  inquiries: number;
  isSold?: boolean;
}

export const MyListings: React.FC = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState<ManagedListing[]>([
    {
      ...MOCK_PRODUCTS[0], // iPhone 13
      views: 142,
      inquiries: 8,
      isSold: false,
    },
    {
      ...MOCK_PRODUCTS[5], // Shoe Rack
      views: 38,
      inquiries: 3,
      isSold: false,
    },
    {
      ...MOCK_PRODUCTS[6], // Nike Air Max
      views: 89,
      inquiries: 6,
      isSold: true,
    }
  ]);

  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');

  const handleMarkSold = (id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSold: !item.isSold } : item))
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredListings = listings.filter((item) =>
    activeTab === 'active' ? !item.isSold : item.isSold
  );

  return (
    <div className="py-4 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">My Listings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage your active products, price drops, and sold items.</p>
        </div>

        <button
          onClick={() => navigate('/sell')}
          className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Listing</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Active ({listings.filter((i) => !i.isSold).length})
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sold'
              ? 'bg-white text-gray-900 shadow-2xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Sold ({listings.filter((i) => i.isSold).length})
        </button>
      </div>

      {/* Listings Table / Cards */}
      {filteredListings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
          <Package className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No {activeTab} listings</h3>
          <p className="text-xs text-gray-500">You don't have any items in this tab right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-gray-300 transition-all"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1b7a53] bg-[#1b7a53]/10 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400">• {item.condition}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-sm font-extrabold text-gray-900">
                    Rs. {item.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="flex items-center gap-6 text-xs text-gray-500 sm:border-x sm:border-gray-100 sm:px-6">
                <div className="text-center">
                  <span className="block font-bold text-gray-900 text-sm">{item.views}</span>
                  <span className="text-[11px] text-gray-400">Views</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-gray-900 text-sm">{item.inquiries}</span>
                  <span className="text-[11px] text-gray-400">Inquiries</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkSold(item.id)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    item.isSold
                      ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      : 'border-[#1b7a53] text-[#1b7a53] hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.isSold ? 'Mark as Active' : 'Mark as Sold'}</span>
                </button>

                <Link
                  to={`/product/${item.id}`}
                  className="p-2 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  title="View Public Page"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 border border-gray-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};