import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '0.75rem',
            },
          }}
        />
        <Routes>
          {/* Auth pages (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin pages */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Main pages with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/categories" element={<ProductsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/*" element={<AccountPage />} />

            {/* Static pages placeholder */}
            <Route path="/about" element={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24"><div className="max-w-7xl mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Us</h1><p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Welcome to ShopModern - your trusted destination for premium products. We're committed to bringing you the best quality at affordable prices.</p></div></div>} />
            <Route path="/contact" element={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24"><div className="max-w-7xl mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1><p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Email: support@shopmodern.com<br />Phone: +1 (555) 123-4567</p></div></div>} />
            <Route path="/wishlist" element={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24"><div className="max-w-7xl mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Wishlist</h1><p className="text-gray-600 dark:text-gray-400">Your wishlist will appear here.</p></div></div>} />

            {/* 404 page */}
            <Route path="*" element={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24"><div className="max-w-7xl mx-auto px-4 py-16 text-center"><h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1><p className="text-gray-600 dark:text-gray-400 mb-8">Page not found</p><a href="/" className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">Go Home</a></div></div>} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
