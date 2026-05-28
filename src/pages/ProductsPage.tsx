import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown, X, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import { formatPrice, calculateDiscount, cn } from '@/utils/helpers';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    rating: searchParams.get('rating') || '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
      if (data) setCategories(data as Category[]);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      let query = supabase.from('products').select('*, category:categories(*)').eq('is_active', true);

      if (filters.category) {
        const { data: catData } = await supabase.from('categories').select('id').eq('slug', filters.category).single();
        if (catData) query = query.eq('category_id', catData.id);
      }

      if (filters.search) query = query.ilike('name', `%${filters.search}%`);
      if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice));
      if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice));
      if (filters.rating) query = query.gte('rating', parseInt(filters.rating));

      switch (filters.sortBy) {
        case 'price_asc': query = query.order('price', { ascending: true }); break;
        case 'price_desc': query = query.order('price', { ascending: false }); break;
        case 'rating': query = query.order('rating', { ascending: false }); break;
        case 'bestselling': query = query.order('reviews_count', { ascending: false }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      const { data } = await query.limit(50);
      if (data) setProducts(data as Product[]);
      setIsLoading(false);
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sortBy: 'newest', rating: '' });
    setSearchParams({});
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(v => v && v !== 'newest').length;
  }, [filters]);

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'bestselling', label: 'Best Selling' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isLoading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                showFilters || activeFilterCount > 0
                  ? 'border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

            <div className="hidden sm:flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2', viewMode === 'grid' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-100')}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2', viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-100')}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <Card padding="lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-700 dark:text-gray-300"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Price</label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Price</label>
                    <Input
                      type="number"
                      placeholder="$1000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-700 dark:text-gray-300"
                    >
                      <option value="">All Ratings</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Clear all filters
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {isLoading ? (
          <div className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
          )}>
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
          )}>
            {products.map((product, index) => {
              const discount = product.compare_at_price ? calculateDiscount(product.price, product.compare_at_price) : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Card hover padding="none" className="overflow-hidden">
                    <div className={cn(viewMode === 'list' && 'flex')}>
                      <Link to={`/products/${product.slug}`} className={cn(viewMode === 'list' && 'w-48 flex-shrink-0')}>
                        <div className="relative">
                          <img
                            src={product.images[0] || 'https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={product.name}
                            className={cn(
                              'object-cover group-hover:scale-105 transition-transform duration-500',
                              viewMode === 'grid' ? 'w-full aspect-square' : 'w-full h-full min-h-[200px]'
                            )}
                          />
                          {product.is_new && <Badge variant="new" className="absolute top-3 left-3">New</Badge>}
                          {discount > 0 && <Badge variant="sale" className="absolute top-3 right-3">-{discount}%</Badge>}
                        </div>
                      </Link>

                      <div className="p-4 flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.category?.name}</p>
                        <Link to={`/products/${product.slug}`}>
                          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1 mt-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={cn('w-3.5 h-3.5', star <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600')} />
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({product.reviews_count})</span>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                            {product.compare_at_price && (
                              <span className="text-sm text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
                            )}
                          </div>
                          <Button size="sm" onClick={() => handleAddToCart(product)}>Add</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
