import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'np';

export const TRANSLATIONS = {
  en: {
    brandTagline: 'Buy Second-Hand. Give It Another Life.',
    explore: 'Explore',
    categories: 'Categories',
    sell: 'Sell',
    safety: 'Safety',
    searchPlaceholder: 'Search items, categories, or cities...',
    savedItems: 'Saved Items',
    messages: 'Messages',
    makeOffer: 'Make Offer',
    buyNow: 'Buy Now',
    messageSeller: 'Message Seller',
    escrowProtected: 'Escrow Protected',
    availableBalance: 'Available Balance',
    lockedInEscrow: 'Locked in Escrow',
    loadWallet: 'Load Wallet',
    withdrawFunds: 'Withdraw Funds',
    inspectItemNotice: '48-Hour Inspection Window Active',
    itemReceivedOk: 'I Received Item & Everything is OK',
    reportIssue: 'I Have an Issue (Report Defect)',
    verifiedSeller: 'Verified Seller',
    fastResponder: 'Quick Responder (<1 hr)',
    idVerified: 'Nagarikta / ID Verified',
    fastHandover: 'Same Day Handover',
  },
  np: {
    brandTagline: 'किन्नुहोस् सेकेन्ड-ह्यान्ड। दिनुहोस् नयाँ जीवन।',
    explore: 'हेर्नुहोस्',
    categories: 'श्रेणीहरू',
    sell: 'बेच्नुहोस्',
    safety: 'सुरक्षा',
    searchPlaceholder: 'सामान, श्रेणी वा सहर खोज्नुहोस्...',
    savedItems: 'मन परेका सामान',
    messages: 'सन्देशहरू',
    makeOffer: 'प्रस्ताव गर्नुहोस्',
    buyNow: 'अहिले किन्नुहोस्',
    messageSeller: 'बिक्रेतालाई सन्देश पठाउनुहोस्',
    escrowProtected: 'एस्क्रो सुरक्षित',
    availableBalance: 'उपलब्ध रकम',
    lockedInEscrow: 'एस्क्रोमा सुरक्षित रकम',
    loadWallet: 'पैसा लोड गर्नुहोस्',
    withdrawFunds: 'पैसा निकाल्नुहोस्',
    inspectItemNotice: '४८ घण्टे सामान जाँच अवधि सक्रिय',
    itemReceivedOk: 'सामान प्राप्त भयो, सबै ठीक छ',
    reportIssue: 'समस्या छ (गुनासो दर्ता)',
    verifiedSeller: 'प्रमाणित बिक्रेता',
    fastResponder: 'छिटो जवाफ दिने (<१ घण्टा)',
    idVerified: 'नागरिकता / परिचय प्रमाणित',
    fastHandover: 'उही दिन डेलिभरी',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kh_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kh_lang', lang);
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};