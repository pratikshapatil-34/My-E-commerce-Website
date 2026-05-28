import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Zap, Shield, Truck, ChevronRight, Play } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import { formatPrice, calculateDiscount } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

const HomePage: React.FC = () => {
  const { state, addToCart, toggleWishlist, isInWishlist } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [featuredRes, categoriesRes, newRes] = await Promise.all([
          supabase.from('products').select('*, category:categories(*)').eq('is_featured', true).eq('is_active', true).limit(8),
          supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('sort_order').limit(8),
          supabase.from('products').select('*, category:categories(*)').eq('is_new', true).eq('is_active', true).limit(4),
        ]);

        if (featuredRes.data) setFeaturedProducts(featuredRes.data as Product[]);
        if (categoriesRes.data) setCategories(categoriesRes.data as Category[]);
        if (newRes.data) setNewArrivals(newRes.data as Product[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
  };

  const testimonials = [
    { id: 1, name: 'Sarah Johnson', role: 'Verified Buyer', content: 'Amazing quality products and super fast delivery. Will definitely shop here again!', rating: 5, image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 2, name: 'Michael Chen', role: 'Verified Buyer', content: 'The customer service is exceptional. They helped me find exactly what I was looking for.', rating: 5, image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 3, name: 'Emily Davis', role: 'Verified Buyer', content: 'Best online shopping experience! The product quality exceeded my expectations.', rating: 5, image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-teal-900/20 pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-2 text-teal-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-semibold">Trending Now</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Discover Products
                <span className="block text-teal-600 dark:text-teal-400">That Inspire</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                Curated selection of premium products designed to elevate your lifestyle.
                Quality craftsmanship meets modern design.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Shop Now
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="lg">
                    Browse Categories
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">50K+</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Happy Customers</p>
                </div>
                <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">1000+</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Products</p>
                </div>
                <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">99%</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Hero"
                  className="rounded-2xl shadow-2xl w-full h-[500px] lg:h-[600px] object-cover"
                />

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -left-8 top-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hidden lg:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Fast Delivery</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Free over $100</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -right-4 bottom-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hidden lg:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Secure Payment</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">100% Protected</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-teal-300 dark:from-teal-800 dark:to-teal-900 rounded-2xl transform rotate-3 scale-105 opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'Orders over $100' },
              { icon: Shield, title: 'Secure Payment', desc: '100% Protected' },
              { icon: Zap, title: 'Fast Delivery', desc: '2-5 Business Days' },
              { icon: Star, title: 'Top Quality', desc: 'Premium Products' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{feature.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Explore our curated collections</p>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center text-teal-600 hover:text-teal-700 font-medium">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group relative block overflow-hidden rounded-xl aspect-square"
                >
                  <img
                    src={category.image_url || `https://images.pexels.com/photos/${[356056, 996329, 1571460, 209296][index % 4]}/pexels-photo-${[356056, 996329, 1571460, 209296][index % 4]}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className="text-white/70 text-sm">Shop Now</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Handpicked for you</p>
            </div>
            <Link to="/products?featured=true" className="hidden sm:flex items-center text-teal-600 hover:text-teal-700 font-medium">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => {
                const discount = product.compare_at_price ? calculateDiscount(product.price, product.compare_at_price) : 0;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card hover padding="none" className="overflow-hidden">
                      <div className="relative">
                        <Link to={`/products/${product.slug}`}>
                          <img
                            src={product.images[0] || 'https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={product.name}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        {product.is_new && <Badge variant="new" className="absolute top-3 left-3">New</Badge>}
                        {discount > 0 && <Badge variant="sale" className="absolute top-3 right-3">-{discount}%</Badge>}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="w-full"
                            size="sm"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.category?.name}</p>
                        <Link to={`/products/${product.slug}`}>
                          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({product.reviews_count})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                          {product.compare_at_price && (
                            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Our Customers Say</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Trusted by thousands of happy shoppers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card padding="lg">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
            <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover amazing products today.
            </p>
            <Link to="/products">
              <Button variant="secondary" size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                Explore Products <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
