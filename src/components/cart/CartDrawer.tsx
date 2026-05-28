import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen }) => {
  const { state, dispatch, updateCartItem, removeFromCart, clearCart } = useApp();

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const handleQuantityChange = async (id: string, quantity: number) => {
    await updateCartItem(id, quantity);
  };

  const handleRemove = async (id: string) => {
    await removeFromCart(id);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cart ({state.cartCount})
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {state.cart.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag className="w-16 h-16" />}
                  title="Your cart is empty"
                  description="Start adding items to your cart"
                  action={
                    <Link to="/products" onClick={handleClose}>
                      <Button>Browse Products</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="p-4 space-y-4">
                  {state.cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <img
                        src={item.product.images[0] || 'https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=200'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.product.brand}
                        </p>
                        <p className="font-semibold text-teal-600 dark:text-teal-400 mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(state.cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{state.cartTotal >= 100 ? 'Free' : formatPrice(9.99)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span>{formatPrice(state.cartTotal + (state.cartTotal >= 100 ? 0 : 9.99))}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link to="/checkout" onClick={handleClose} className="block">
                    <Button className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
