import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Review } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatPrice, calculateDiscount, cn } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';
import { PageLoader } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state, addToCart, toggleWishlist, isInWishlist } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setIsLoading(true);

      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (data) {
        setProduct(data as Product);
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, user:auth.users(email)')
          .eq('product_id', data.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(10);
        if (reviewsData) setReviews(reviewsData as Review[]);

        if (data.category_id) {
          const { data: related } = await supabase
            .from('products')
            .select('*, category:categories(*)')
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .eq('is_active', true)
            .limit(4);
          if (related) setRelatedProducts(related as Product[]);
        }
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    await toggleWishlist(product);
    toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  if (isLoading) return <PageLoader />;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
        <Link to="/products"><Button>Browse Products</Button></Link>
      </div>
    </div>
  );

  const discount = product.compare_at_price ? calculateDiscount(product.price, product.compare_at_price) : 0;
  const images = product.images.length > 0 ? product.images : ['https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=800'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-teal-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-teal-600">Products</Link>
          <ChevronRight className="w-4 h-4" />
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-teal-600">{product.category.name}</Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_new && <Badge variant="new" className="absolute top-4 left-4">New</Badge>}
              {discount > 0 && <Badge variant="sale" className="absolute top-4 right-4">-{discount}%</Badge>}
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === index ? 'border-teal-600' : 'border-gray-200 dark:border-gray-700'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category?.name}</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <Rating value={product.rating} reviews={product.reviews_count} size="md" />
              <button onClick={() => setActiveTab('reviews')} className="text-sm text-teal-600 hover:text-teal-700">
                Read reviews
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.compare_at_price && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.compare_at_price)}</span>
                  <Badge variant="sale">Save {formatPrice(product.compare_at_price - product.price)}</Badge>
                </>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300">{product.short_description || product.description}</p>

            {/* Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 font-medium text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button onClick={handleAddToCart} className="flex-1" size="lg">
                  Add to Cart - {formatPrice(product.price * quantity)}
                </Button>

                <button
                  onClick={handleToggleWishlist}
                  className={cn(
                    'p-3 rounded-lg border transition-colors',
                    isInWishlist(product.id)
                      ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500'
                  )}
                >
                  <Heart className={cn('w-6 h-6', isInWishlist(product.id) && 'fill-current')} />
                </button>

                <button className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {product.quantity < 10 && product.quantity > 0 && (
                <p className="text-sm text-orange-600">Only {product.quantity} left in stock!</p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</p>
                <p className="text-xs text-gray-500">Over $100</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Secure Payment</p>
                <p className="text-xs text-gray-500">100% Protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Easy Returns</p>
                <p className="text-xs text-gray-500">30 Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('description')}
              className={cn(
                'px-6 py-3 font-medium transition-colors',
                activeTab === 'description'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              )}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={cn(
                'px-6 py-3 font-medium transition-colors',
                activeTab === 'reviews'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              )}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'description' ? (
              <Card padding="lg">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{product.description}</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <Card padding="lg" className="text-center text-gray-500 dark:text-gray-400">
                    No reviews yet. Be the first to review this product!
                  </Card>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id} padding="lg">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 dark:text-teal-400 font-semibold">
                            {review.user?.email?.[0]?.toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">{review.user?.email?.split('@')[0] || 'Anonymous'}</span>
                            {review.is_verified_purchase && (
                              <Badge variant="success" size="sm">Verified Purchase</Badge>
                            )}
                          </div>
                          <Rating value={review.rating} showValue={false} size="sm" />
                          <h4 className="font-medium text-gray-900 dark:text-white mt-2">{review.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group">
                  <Card hover padding="none" className="overflow-hidden">
                    <img
                      src={p.images[0] || 'https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={p.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{p.name}</h3>
                      <p className="text-teal-600 dark:text-teal-400 font-semibold mt-1">{formatPrice(p.price)}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
