import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import AuthModal from './components/auth/AuthModal';
import ScrollToTop from './components/ui/ScrollToTop';
import RouteErrorBoundary from './components/ui/RouteErrorBoundary';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/seller/Dashboard';
import AddProduct from './pages/seller/AddProduct';
import ProductEdit from './pages/seller/ProductEdit';
import Payouts from './pages/seller/Payouts';
import SellerOnboarding from './pages/seller/SellerOnboarding';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import ControlsSite from './pages/admin/ControlsSite';
import ControlsPolicies from './pages/admin/ControlsPolicies';
import ControlsSettlements from './pages/admin/ControlsSettlements';
import { StoreProvider } from './context/StoreContext';
import { useAuthStore } from './context/stores';

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  const effectiveRole = user?.role || (user?.isAdmin ? 'admin' : user?.isSeller ? 'seller' : 'user');
  if (roles?.length && !roles.includes(effectiveRole)) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const isBackofficeRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/seller');

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary flex flex-col relative">
      <ScrollToTop />
      {/* Global Toast Notifications */}
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      
      {/* Global Auth Modals */}
      <AuthModal />

      <div className="relative z-10 flex min-h-screen flex-col">
        {!isBackofficeRoute && <Navbar />}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <RouteErrorBoundary>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/sellers" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><ControlsSite /></ProtectedRoute>} />
                  <Route path="/admin/controls" element={<ProtectedRoute roles={['admin']}><ControlsSite /></ProtectedRoute>} />
                  <Route path="/admin/controls/site" element={<ProtectedRoute roles={['admin']}><ControlsSite /></ProtectedRoute>} />
                  <Route path="/admin/controls/policies" element={<ProtectedRoute roles={['admin']}><ControlsPolicies /></ProtectedRoute>} />
                  <Route path="/admin/controls/settlements" element={<ProtectedRoute roles={['admin']}><ControlsSettlements /></ProtectedRoute>} />
                  <Route path="/seller/onboarding" element={<ProtectedRoute><SellerOnboarding /></ProtectedRoute>} />
                  <Route path="/seller/dashboard" element={<ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
                  <Route path="/seller/add-product" element={<ProtectedRoute roles={['seller', 'admin']}><AddProduct /></ProtectedRoute>} />
                  <Route path="/seller/orders" element={<ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
                  <Route path="/seller/inventory" element={<ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
                  <Route path="/seller/products/:id/edit" element={<ProtectedRoute roles={['seller', 'admin']}><ProductEdit /></ProtectedRoute>} />
                  <Route path="/seller/analytics" element={<ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
                  <Route path="/seller/payouts" element={<ProtectedRoute roles={['seller', 'admin']}><Payouts /></ProtectedRoute>} />
                  <Route path="/seller/settings" element={<ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
                </Routes>
              </RouteErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
        {!isBackofficeRoute && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
}

export default App;
