import React, { useState } from 'react'
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import SearchModal from './SearchModal'
import CartModal from './CartModal'
import UserMenu from './UserMenu'

const Header = () => {
  const { state, dispatch } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getTotalItems = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleSearch = () => {
    dispatch({ type: 'TOGGLE_SEARCH' })
  }

  const handleUserAccount = () => {
    dispatch({ type: 'TOGGLE_USER_MENU' })
  }

  const handleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-indigo-600">ModernShop</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-indigo-600 transition-colors">Home</a>
            <a href="#products" className="text-gray-700 hover:text-indigo-600 transition-colors">Products</a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600 transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors">Contact</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <button 
              onClick={handleSearch}
              className={`text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100 ${
                state.isSearchOpen ? 'text-indigo-600 bg-indigo-50' : ''
              }`}
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={handleUserAccount}
              className={`text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100 ${
                state.isUserMenuOpen ? 'text-indigo-600 bg-indigo-50' : ''
              }`}
              title="My Account"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={handleCart}
              className={`text-gray-700 hover:text-indigo-600 transition-colors relative p-2 rounded-lg hover:bg-gray-100 ${
                state.isCartOpen ? 'text-indigo-600 bg-indigo-50' : ''
              }`}
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">Home</a>
              <a href="#products" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">Products</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">About</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">Contact</a>
              <div className="flex items-center space-x-4 px-3 py-2">
                <button 
                  onClick={handleSearch}
                  className={`text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100 ${
                    state.isSearchOpen ? 'text-indigo-600 bg-indigo-50' : ''
                  }`}
                >
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleUserAccount}
                  className={`text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100 ${
                    state.isUserMenuOpen ? 'text-indigo-600 bg-indigo-50' : ''
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleCart}
                  className={`text-gray-700 hover:text-indigo-600 transition-colors relative p-2 rounded-lg hover:bg-gray-100 ${
                    state.isCartOpen ? 'text-indigo-600 bg-indigo-50' : ''
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Modal */}
        <SearchModal />
      </div>
      
      {/* Cart Modal */}
      <CartModal />
    </header>
  )
}

export default Header