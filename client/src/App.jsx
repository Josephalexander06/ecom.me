import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/seller/Dashboard';
import AddProduct from './pages/seller/AddProduct';
import Orders from './pages/Orders';
import { StoreProvider } from './context/StoreContext';

function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="min-h-screen bg-[#eaeded] text-[#0f1111] flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/add-product" element={<AddProduct />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;
