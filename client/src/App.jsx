import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreloaderScreen from './components/ui/PreloaderScreen';
import CustomCursor from './components/ui/CustomCursor';
import Navbar from './components/ui/Navbar';
import ParticleBackground from './components/ui/ParticleBackground';
import AISearchOrb from './components/ui/AISearchOrb';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/seller/Dashboard';
import AddProduct from './pages/seller/AddProduct';
import useSmoothScroll from './hooks/useSmoothScroll';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Enable Lenis Smooth Scroll
  useSmoothScroll();

  return (
    <Router>
      <main className="relative min-h-screen bg-bg-deep selection:bg-accent-primary selection:text-black">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-glass)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(10px)',
            }
          }}
        />
        
        {isLoading ? (
          <PreloaderScreen onComplete={() => setIsLoading(false)} />
        ) : (
          <>
            <CustomCursor />
            <ParticleBackground />
            <Navbar />
            <AISearchOrb />
            
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/add-product" element={<AddProduct />} />
              </Routes>
            </AnimatePresence>
          </>
        )}
      </main>
    </Router>
  );
}

export default App;
