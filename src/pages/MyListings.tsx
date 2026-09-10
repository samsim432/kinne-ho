import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ProductCardSkeleton } from '../components/ui/Skeletons';
import { 
  Package, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Eye, 
  Trash2, 
  Edit3,
  ShoppingBag
} from 'lucide-react';

export const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
  const [isLoading, setIsLoading] = useState(true);

  // User's own listings simulation
  const [myListings, setMyListings] = useState(MOCK_PRODUCTS.slice(0, 3));

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleDelete = (id: string) => {
    setMyListings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="py-6 space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Listings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your inventory, tracking, and sold items.
          </p>
        </div>

        <button
          onClick={() => navigate('/sell')}
          className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs text-gray-500 font-semibold">Active Inventory</span>
          <p className="text-2xl font-extrabold text-gray-900">{myListings.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs text-gray-500 font-semibold">Total Views</span>
          <p className="text-2xl font-extrabold text-gray-900">418</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs text-gray-500 font-semibold">Earnings in Escrow</span>
          <p className="text-2xl font-extrabold text-[#1b7a53]">Rs. 46,000</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-[#1b7a53] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Active Listings ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('sold')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'sold'
              ? 'bg-[#1b7a53] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Sold & Completed (1)
        </button>
      </div>

      {/* Listings Stream */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : activeTab === 'active' ? (
        myListings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center mx-auto">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">No active listings</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Declutter your home and earn money by listing your unused items today.
              </p>
            </div>
            <button
              onClick={() => navigate('/sell')}
              className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Start Selling
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#1b7a53] text-white shadow-2xs">
                      Active
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-extrabold text-[#1b7a53]">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> 84 views
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="text-xs font-semibold text-gray-700 hover:text-[#1b7a53] cursor-pointer"
                  >
                    View Public
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate('/sell')}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Sold Tab */
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80"
              alt="Nike Air Max"
              className="w-16 h-16 rounded-xl object-cover bg-gray-100"
            />
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#1b7a53] bg-emerald-50 px-2 py-0.5 rounded">
                COMPLETED & FUNDS RELEASED
              </span>
              <h4 className="text-sm font-bold text-gray-900">Nike Air Max 270 Black</h4>
              <p className="text-xs font-extrabold text-gray-900">Rs. 4,500</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/wallet')}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold px-3.5 py-2 rounded-xl text-gray-700"
          >
            View Payout
          </button>
        </div>
      )}

    </div>
  );
};