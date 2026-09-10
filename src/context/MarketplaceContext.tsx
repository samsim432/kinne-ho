import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { INITIAL_THREADS } from '../data/mockChatData';
import type { ProductItem } from '../types/marketplace';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface MarketplaceContextType {
  walletBalance: number;
  inEscrowBalance: number;
  favorites: string[]; // product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  loadWallet: (amount: number, method: string) => void;
  deductForEscrow: (amount: number) => boolean;
  releaseEscrowToSeller: (amount: number) => void;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('kh_wallet_balance');
    return saved ? Number(saved) : 65000;
  });

  const [inEscrowBalance, setInEscrowBalance] = useState<number>(() => {
    const saved = localStorage.getItem('kh_escrow_balance');
    return saved ? Number(saved) : 46000;
  });

  // 2. Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('kh_favorites');
    return saved ? JSON.parse(saved) : ['1', '5', '7'];
  });

  // 3. Search Modal & Toast state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('kh_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('kh_escrow_balance', inEscrowBalance.toString());
  }, [inEscrowBalance]);

  useEffect(() => {
    localStorage.setItem('kh_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(
        exists ? 'Removed from favorites' : 'Saved to favorites ❤️',
        exists ? 'Item removed from your wishlist' : 'You can view this anytime in your Saved hub',
        exists ? 'info' : 'success'
      );
      return updated;
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const loadWallet = (amount: number, method: string) => {
    setWalletBalance((prev) => prev + amount);
    showToast(`Rs. ${amount.toLocaleString()} loaded!`, `Funds credited via ${method.toUpperCase()}`, 'success');
  };

  const deductForEscrow = (amount: number): boolean => {
    if (walletBalance < amount) {
      showToast('Insufficient wallet balance', 'Please load your wallet via eSewa or Khalti', 'error');
      return false;
    }
    setWalletBalance((prev) => prev - amount);
    setInEscrowBalance((prev) => prev + amount);
    showToast('Payment locked in Escrow 🔒', `Rs. ${amount.toLocaleString()} held safely until inspection`, 'success');
    return true;
  };

  const releaseEscrowToSeller = (amount: number) => {
    setInEscrowBalance((prev) => Math.max(0, prev - amount));
    showToast('Funds released to seller! 🎉', `Rs. ${amount.toLocaleString()} transferred successfully`, 'success');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        walletBalance,
        inEscrowBalance,
        favorites,
        toggleFavorite,
        isFavorite,
        loadWallet,
        deductForEscrow,
        releaseEscrowToSeller,
        toasts,
        showToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
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