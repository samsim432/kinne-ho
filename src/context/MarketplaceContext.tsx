import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import type { ProductItem } from '../types/marketplace';
import type { EscrowOrder } from '../types/escrow';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface MarketplaceContextType {
  products: ProductItem[];
  favorites: string[];
  orders: EscrowOrder[];
  toasts: ToastItem[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  createEscrowOrder: (orderData: Partial<EscrowOrder>) => EscrowOrder;
  getOrderById: (orderId: string) => EscrowOrder | undefined;
  verifyHandshakePin: (orderId: string, pin: string) => boolean;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kinneho_favorites');
      return saved ? JSON.parse(saved) : ['1', '2'];
    } catch {
      return ['1', '2'];
    }
  });

  const [orders, setOrders] = useState<EscrowOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kinneho_orders');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'KH-8941',
              productId: '1',
              productTitle: 'iPhone 13 128GB Midnight',
              productPrice: 48000,
              productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
              sellerName: 'Samir Simkhada',
              buyerName: 'Shruti Maharjan',
              deliveryMethod: 'self_pickup',
              deliveryFee: 0,
              totalAmount: 48000,
              handshakePin: '4829',
              status: 'escrow_locked',
              paymentGateway: 'esewa',
              createdAt: new Date().toISOString(),
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kinneho_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('kinneho_orders', JSON.stringify(orders));
  }, [orders]);

  // Memoized toast triggers to prevent infinite loops
  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'Item removed from your saved list.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️', 'Item saved to your favorites.', 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const createEscrowOrder = (orderData: Partial<EscrowOrder>): EscrowOrder => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: EscrowOrder = {
      id: `KH-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: orderData.productId || '1',
      productTitle: orderData.productTitle || 'Item',
      productPrice: orderData.productPrice || 0,
      productImage: orderData.productImage || '',
      sellerName: orderData.sellerName || 'Verified Seller',
      buyerName: orderData.buyerName || 'Buyer',
      deliveryMethod: orderData.deliveryMethod || 'self_pickup',
      deliveryFee: orderData.deliveryFee || 0,
      totalAmount: orderData.totalAmount || 0,
      handshakePin: randomPin,
      status: 'escrow_locked',
      paymentGateway: orderData.paymentGateway || 'esewa',
      createdAt: new Date().toISOString(),
      address: orderData.address,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);

  const verifyHandshakePin = (orderId: string, pin: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      showToast('Order not found', 'Invalid order ID.', 'error');
      return false;
    }

    if (order.handshakePin === pin.trim()) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' as const } : o))
      );
      showToast('Handshake Verified! 🤝', 'PIN confirmed. Funds released to seller wallet.', 'success');
      return true;
    } else {
      showToast('Invalid PIN', 'The 4-digit code does not match the buyer OTP.', 'error');
      return false;
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        favorites,
        orders,
        toasts,
        isSearchOpen,
        setIsSearchOpen,
        toggleFavorite,
        isFavorite,
        createEscrowOrder,
        getOrderById,
        verifyHandshakePin,
        showToast,
        removeToast,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};