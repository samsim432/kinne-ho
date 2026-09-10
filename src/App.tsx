import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/footer/Footer';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F9FAF9] flex flex-col">
        <Navbar />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}