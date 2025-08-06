import React, { useState } from 'react'
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <button className="text-gray-700 hover:text-indigo-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-gray-700 hover:text-indigo-600 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="text-gray-700 hover:text-indigo-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
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
                <button className="text-gray-700 hover:text-indigo-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="text-gray-700 hover:text-indigo-600 transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <button className="text-gray-700 hover:text-indigo-600 transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
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