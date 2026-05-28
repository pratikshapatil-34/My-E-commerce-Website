import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Users, ShoppingCart, DollarSign, TrendingUp, Plus, Search, Filter, MoreHorizontal, CreditCard as Edit2, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Order } from '@/types';
import { formatPrice, formatDate, cn } from '@/utils/helpers';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      ]);

      if (ordersRes.data) {
        setRecentOrders(ordersRes.data as Order[]);
        setStats(prev => ({
          ...prev,
          totalOrders: ordersRes.data?.length || 0,
          totalRevenue: ordersRes.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
        }));
      }

      if (productsRes.data) {
        setProducts(productsRes.data as Product[]);
        setStats(prev => ({ ...prev, totalProducts: productsRes.data?.length || 0 }));
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const salesData = [
    { name: 'Jan', sales: 4000, orders: 24 },
    { name: 'Feb', sales: 3000, orders: 18 },
    { name: 'Mar', sales: 5000, orders: 35 },
    { name: 'Apr', sales: 4500, orders: 28 },
    { name: 'May', sales: 6000, orders: 42 },
    { name: 'Jun', sales: 5500, orders: 38 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35 },
    { name: 'Fashion', value: 25 },
    { name: 'Home', value: 20 },
    { name: 'Sports', value: 12 },
    { name: 'Other', value: 8 },
  ];

  const COLORS = ['#0d9488', '#0f766e', '#115e59', '#134e4a', '#042f2e'];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const orderStatusColors: Record<string, string> = {
    pending: 'warning',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'default',
  } as const;

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Admin</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', active: true },
            { icon: Package, label: 'Products', path: '/admin/products' },
            { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
            { icon: Users, label: 'Customers', path: '/admin/customers' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                item.active
                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, label: 'Total Revenue', value: formatPrice(stats.totalRevenue), trend: '+12.5%', color: 'bg-green-500' },
            { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders.toString(), trend: '+8.2%', color: 'bg-blue-500' },
            { icon: Package, label: 'Products', value: stats.totalProducts.toString(), trend: '+3.1%', color: 'bg-purple-500' },
            { icon: Users, label: 'Customers', value: '1,234', trend: '+5.4%', color: 'bg-orange-500' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card padding="lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    <span className="text-sm text-green-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4" /> {stat.trend}
                    </span>
                  </div>
                  <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', stat.color)}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card padding="lg" className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sales Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#0d9488" fill="#0d948820" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card padding="lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card padding="none" className="mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{order.order_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={orderStatusColors[order.status]}>{order.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Products Table */}
        <Card padding="none">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Products</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Product</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.slice(0, 10).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || 'https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category?.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.quantity > 10 ? 'success' : product.quantity > 0 ? 'warning' : 'danger'}>
                        {product.quantity} in stock
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
