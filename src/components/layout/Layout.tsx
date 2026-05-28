import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import SearchOverlay from './SearchOverlay';
import { useApp } from '@/context/AppContext';

const Layout: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer isOpen={state.isCartOpen} onClose={() => ({})} />
      <SearchOverlay isOpen={state.isSearchOpen} onClose={() => ({})} />
    </div>
  );
};

export default Layout;
