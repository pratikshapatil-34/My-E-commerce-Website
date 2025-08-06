import React, { useState } from 'react'
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(3)

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    console.log('Search clicked')
  }

  const handleUserAccount = () => {
    console.log('User account clicked')
    alert('User account functionality - would redirect to login/profile page')
  }

  const handleCart = () => {
    console.log('Shopping cart clicked')
    alert(`Shopping cart clicked - ${cartCount} items in cart`)
  }
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
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
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleSearch}
              className="text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={handleUserAccount}
              className="text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              title="My Account"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={handleCart}
              className="text-gray-700 hover:text-indigo-600 transition-colors relative p-2 rounded-lg hover:bg-gray-100"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>

          {/* Search Bar (when opened) */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    autoFocus
                  />
                  <button className="btn-primary">Search</button>
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
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
                  className="text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleUserAccount}
                  className="text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <User className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleCart}
                  className="text-gray-700 hover:text-indigo-600 transition-colors relative p-2 rounded-lg hover:bg-gray-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header