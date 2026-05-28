import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Edit2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Order, Address, WishlistItem } from '@/types';
import { formatDate, formatPrice, cn } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, signOut, fetchUserOrders } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!state.user) return;

      setIsLoading(true);
      const [ordersRes, addressesRes, wishlistRes] = await Promise.all([
        supabase.from('orders').select('*, items:order_items(*)').eq('user_id', state.user.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('addresses').select('*').eq('user_id', state.user.id),
        supabase.from('wishlists').select('*, product:products(*)').eq('user_id', state.user.id),
      ]);

      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (addressesRes.data) setAddresses(addressesRes.data as Address[]);
      if (wishlistRes.data) setWishlist(wishlistRes.data as WishlistItem[]);
      setIsLoading(false);
    };

    fetchUserData();
  }, [state.user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const orderStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card padding="lg" className="sticky top-24">
              <div className="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{state.user?.email?.split('@')[0]}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{state.user?.email}</p>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                      activeTab === tab.id
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'orders' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>
                  {orders.length === 0 ? (
                    <Card padding="lg" className="text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet</p>
                      <Link to="/products"><Button className="mt-4">Start Shopping</Button></Link>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} padding="lg">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-gray-900 dark:text-white">{order.order_number}</span>
                                <Badge className={orderStatusColors[order.status]}>{order.status}</Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(order.total)}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{order.items?.length || 0} items</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Wishlist</h1>
                  {wishlist.length === 0 ? (
                    <Card padding="lg" className="text-center">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Your wishlist is empty</p>
                      <Link to="/products"><Button className="mt-4">Browse Products</Button></Link>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {wishlist.map((item) => (
                        <Link key={item.id} to={`/products/${item.product?.slug}`}>
                          <Card hover padding="none" className="flex overflow-hidden">
                            <img
                              src={item.product?.images[0] || 'https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=200'}
                              alt={item.product?.name}
                              className="w-24 h-24 object-cover"
                            />
                            <div className="flex-1 p-4">
                              <h3 className="font-medium text-gray-900 dark:text-white">{item.product?.name}</h3>
                              <p className="text-teal-600 dark:text-teal-400 font-semibold">{formatPrice(item.product?.price || 0)}</p>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Addresses</h1>
                    <Button size="sm">Add New Address</Button>
                  </div>
                  {addresses.length === 0 ? (
                    <Card padding="lg" className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No saved addresses</p>
                      <Button className="mt-4">Add Address</Button>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <Card key={address.id} padding="lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {address.first_name} {address.last_name}
                              </p>
                              {address.is_default && <Badge variant="success" size="sm" className="mt-1">Default</Badge>}
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {address.address_line1}
                                {address.address_line2 && <>, {address.address_line2}</>}
                                <br />
                                {address.city}, {address.state} {address.postal_code}
                              </p>
                            </div>
                            <button className="text-teal-600 hover:text-teal-700">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>
                  <Card padding="lg">
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                          <input
                            type="email"
                            value={state.user?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          />
                        </div>
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
