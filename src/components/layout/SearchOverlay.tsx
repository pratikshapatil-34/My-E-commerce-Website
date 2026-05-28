import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .ilike('name', `%${query}%`)
          .eq('is_active', true)
          .limit(8);

        if (data) setResults(data as Product[]);
      } catch {
        setResults([]);
      }
      setIsLoading(false);
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_SEARCH' });
    setQuery('');
    setResults([]);
  };

  const popularSearches = ['Headphones', 'Watch', 'Backpack', 'T-Shirt', 'Laptop'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Results */}
              {query.length > 0 && (
                <div className="mt-4 pb-4">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Searching...</div>
                  ) : results.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 mb-2">{results.length} results</p>
                      <div className="grid gap-2">
                        {results.map((product) => (
                          <Link
                            key={product.id}
                            to={`/products/${product.slug}`}
                            onClick={handleClose}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <img
                              src={product.images[0] || 'https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=100'}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.category?.name}</p>
                            </div>
                            <p className="font-semibold text-teal-600 dark:text-teal-400">
                              {formatPrice(product.price)}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No products found for "{query}"
                    </div>
                  )}
                </div>
              )}

              {/* Popular Searches */}
              {query.length === 0 && (
                <div className="mt-4 pb-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
