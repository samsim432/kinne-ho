import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../data/mockData';
import type { ProductItem } from '../types/marketplace';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface EscrowOrder {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  sellerName: string;
  buyerName: string;
  deliveryMethod: 'self_pickup' | 'doorstep';
  deliveryFee: number;
  totalAmount: number;
  address: string;
  handshakePin: string;
  status: 'locked' | 'in_transit' | 'delivered' | 'completed' | 'disputed';
  paymentGateway: 'esewa' | 'khalti' | 'wallet';
  createdAt: string;
}

interface MarketplaceContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toasts: ToastItem[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  orders: EscrowOrder[];
  createEscrowOrder: (order: Omit<EscrowOrder, 'id' | 'createdAt' | 'status' | 'handshakePin'>) => EscrowOrder;
  verifyHandshakePin: (orderId: string, pin: string) => boolean;
  getOrderById: (orderId: string) => EscrowOrder | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('kh_favorites');
    return saved ? JSON.parse(saved) : ['1', '2'];
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [orders, setOrders] = useState<EscrowOrder[]>(() => {
    const saved = localStorage.getItem('kh_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'KH-8941',
        productId: '1',
        productTitle: 'iPhone 13 128GB Midnight Black',
        productPrice: 48000,
        productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        sellerName: 'Samir Simkhada',
        buyerName: 'Shruti Maharjan',
        deliveryMethod: 'self_pickup',
        deliveryFee: 0,
        totalAmount: 48000,
        address: 'New Baneshwor, Kathmandu',
        handshakePin: '4829',
        status: 'locked',
        paymentGateway: 'esewa',
        createdAt: 'Today, 2:15 PM'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kh_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('kh_orders', JSON.stringify(orders));
  }, [orders]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(
        exists ? 'Removed from Wishlist' : 'Saved to Wishlist ❤️',
        exists ? 'Item removed from your favorites.' : 'You can find it anytime in saved items.',
        'info'
      );
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const createEscrowOrder = (orderData: Omit<EscrowOrder, 'id' | 'createdAt' | 'status' | 'handshakePin'>) => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: EscrowOrder = {
      ...orderData,
      id: `KH-${Math.floor(1000 + Math.random() * 9000)}`,
      handshakePin: randomPin,
      status: 'locked',
      createdAt: 'Just now'
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const verifyHandshakePin = (orderId: string, inputPin: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;
    if (order.handshakePin === inputPin.trim()) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' as const } : o))
      );
      showToast('Handshake Verified! 🤝', 'Escrow funds have been successfully released to the seller.', 'success');
      return true;
    }
    showToast('Invalid PIN', 'The 4-digit Handshake OTP provided does not match.', 'error');
    return false;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        removeToast,
        orders,
        createEscrowOrder,
        verifyHandshakePin,
        getOrderById
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
};