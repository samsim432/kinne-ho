import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { MobileBottomNav } from './components/navbar/MobileBottomNav';
import { Footer } from './components/footer/Footer';
import { SearchModal } from './components/search/SearchModal';
import { ToastContainer } from './components/ui/ToastContainer';

import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { ProductDetails } from './pages/ProductDetails';
import { Sell } from './pages/Sell';
import { Messages } from './pages/Messages';
import { Favorites } from './pages/Favorites';
import { MyListings } from './pages/MyListings';
import { UserProfile } from './pages/UserProfile';
import { Checkout } from './pages/Checkout';
import { OrderDetail } from './pages/OrderDetail';
import { Wallet } from './pages/Wallet';
import { Safety } from './pages/Safety';
import { HowItWorks } from './pages/HowItWorks'; // Added
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';
import { NotFound } from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { LanguageProvider } from './context/LanguageContext';

export const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <MarketplaceProvider>
            <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900 antialiased selection:bg-[#1b7a53]/20 selection:text-[#1b7a53]">
              <Navbar />
              
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/sell" element={<Sell />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/my-listings" element={<MyListings />} />
                  <Route path="/profile/:username" element={<UserProfile />} />
                  <Route path="/checkout/:productId" element={<Checkout />} />
                  <Route path="/order/:orderId" element={<OrderDetail />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/safety" element={<Safety />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
              <MobileBottomNav />
              <SearchModal />
              <ToastContainer />
            </div>
          </MarketplaceProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;