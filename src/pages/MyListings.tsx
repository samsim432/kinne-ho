import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCardSkeleton } from '../components/ui/Skeletons';
import { Plus, Eye, Heart, Tag, Trash2, Package, ExternalLink } from 'lucide-react';

interface UserListingItem {
  id: string;
  title: string;
  condition: string;
  price: number;
  originalPrice?: number;
  views: number;
  favorites: number;
  offers: number;
  listedAgo: string;
  image: string;
  status: string;
}

export const MyListings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'drafts'>('active');
  const [myItems, setMyItems] = useState<UserListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyListings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: UserListingItem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          condition: item.condition,
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          views: item.views_count || 0,
          favorites: 0,
          offers: 0,
          listedAgo: new Date(item.created_at).toLocaleDateString(),
          image: item.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
          status: item.status,
        }));
        setMyItems(mapped);
      }
    } catch (err) {
      console.error('Error fetching user listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMyItems((prev) => prev.filter((item) => item.id !== id));
      showToast('Listing Removed', 'The item was deleted from the marketplace.', 'info');
    } catch (err: any) {
      showToast('Error', err.message || 'Could not delete listing', 'error');
    }
  };

  const filteredItems = myItems.filter((item) => {
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'sold') return item.status === 'sold';
    return item.status === 'draft';
  });

  return (
    <div className="py-2 max-w-2xl mx-auto space-y-5">
      
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My listings</h1>
        <p className="text-xs text-gray-500">Track views, favourites and offers on your real items.</p>
      </div>

      {/* New Listing Action Button */}
      <button
        onClick={() => navigate('/sell')}
        className="bg-[#1b7a53] hover:bg-[#156343] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>+ New listing</span>
      </button>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Active ({myItems.filter(i => i.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'sold'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Sold ({myItems.filter(i => i.status === 'sold').length})
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'drafts'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Drafts (0)
        </button>
      </div>

      {/* Listings Stream */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : !user ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3 shadow-2xs">
          <p className="text-sm font-bold text-gray-900">Please sign in to view your listings</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-[#1b7a53] text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Sign In
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#1b7a53] flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">No {activeTab} listings found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven't published any items in this category yet.
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
        <div className="space-y-3">
          {filteredItems.map((item) => (
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
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                  >
                    <span>View Listing</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteListing(item.id)}
                  className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete listing"
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