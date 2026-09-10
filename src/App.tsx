import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { SearchModal } from './components/search/SearchModal';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/footer/Footer';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { ProductDetails } from './pages/ProductDetails';
import { Sell } from './pages/Sell';
import { UserProfile } from './pages/UserProfile';
import { Messages } from './pages/Messages';
import { Favorites } from './pages/Favorites';
import { Auth } from './pages/Auth';
import { MyListings } from './pages/MyListings';
import { Safety } from './pages/Safety';
import { Wallet } from './pages/Wallet';
import { Checkout } from './pages/Checkout';
import { OrderDetail } from './pages/OrderDetail';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <LanguageProvider>
      <MarketplaceProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#F9FAF9] flex flex-col selection:bg-[#1b7a53]/20">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/checkout/:productId" element={<Checkout />} />
                <Route path="/order/:orderId" element={<OrderDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
            <ToastContainer />
            <SearchModal />
          </div>
        </BrowserRouter>
      </MarketplaceProvider>
    </LanguageProvider>
  );
}