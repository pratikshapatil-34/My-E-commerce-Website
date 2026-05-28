import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Check, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatPrice, cn } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, createOrder, addAddress, clearCart } = useApp();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: state.user?.email || '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 9.99, time: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 19.99, time: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 39.99, time: '1 business day' },
  ];

  const subtotal = state.cartTotal;
  const shipping = shippingMethod === 'standard' && subtotal >= 100 ? 0 : shippingOptions.find(o => o.id === shippingMethod)?.price || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (state.cart.length === 0 && !orderId) {
      navigate('/products');
    }
  }, [state.cart.length, orderId, navigate]);

  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingInfo.firstName) newErrors.firstName = 'Required';
    if (!shippingInfo.lastName) newErrors.lastName = 'Required';
    if (!shippingInfo.email) newErrors.email = 'Required';
    if (!shippingInfo.address) newErrors.address = 'Required';
    if (!shippingInfo.city) newErrors.city = 'Required';
    if (!shippingInfo.state) newErrors.state = 'Required';
    if (!shippingInfo.zipCode) newErrors.zipCode = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) return;

    setIsProcessing(true);
    try {
      const order = await createOrder({
        shipping_cost: shipping,
        tax,
        payment_method: paymentMethod,
      });

      if (order) {
        setOrderId(order.id);
        setStep(3);
        toast.success('Order placed successfully!');
      } else {
        toast.error('Failed to place order');
      }
    } catch {
      toast.error('An error occurred');
    }
    setIsProcessing(false);
  };

  if (orderId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Order ID: <span className="font-mono font-semibold">{orderId}</span>
            </p>
            <div className="flex gap-3">
              <Link to="/account/orders" className="flex-1">
                <Button variant="outline" className="w-full">View Orders</Button>
              </Link>
              <Link to="/products" className="flex-1">
                <Button className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          {['Shipping', 'Payment', 'Confirm'].map((label, index) => (
            <React.Fragment key={label}>
              <div className={cn(
                'flex items-center gap-2',
                step >= index + 1 ? 'text-teal-600' : 'text-gray-400'
              )}>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold',
                  step >= index + 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                )}>
                  {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className="hidden sm:inline font-medium">{label}</span>
              </div>
              {index < 2 && <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card padding="lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Shipping Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="First Name" value={shippingInfo.firstName} onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })} error={errors.firstName} />
                    <Input label="Last Name" value={shippingInfo.lastName} onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })} error={errors.lastName} />
                    <Input label="Email" type="email" value={shippingInfo.email} onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })} error={errors.email} />
                    <Input label="Phone" value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} />
                    <div className="md:col-span-2">
                      <Input label="Street Address" value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} error={errors.address} />
                    </div>
                    <Input label="Apartment/Suite (Optional)" value={shippingInfo.apartment} onChange={(e) => setShippingInfo({ ...shippingInfo, apartment: e.target.value })} />
                    <Input label="City" value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} error={errors.city} />
                    <Input label="State" value={shippingInfo.state} onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} error={errors.state} />
                    <Input label="ZIP Code" value={shippingInfo.zipCode} onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })} error={errors.zipCode} />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Shipping Method</h3>
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className={cn(
                            'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors',
                            shippingMethod === option.id
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={shippingMethod === option.id}
                              onChange={() => setShippingMethod(option.id)}
                              className="text-teal-600"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{option.name}</p>
                              <p className="text-sm text-gray-500">{option.time}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {option.id === 'standard' && subtotal >= 100 ? 'Free' : formatPrice(option.price)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-6" onClick={() => setStep(2)}>
                    Continue to Payment
                  </Button>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card padding="lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment Method
                  </h2>

                  <div className="space-y-4">
                    {[
                      { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'paypal', name: 'PayPal', icon: null },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors',
                          paymentMethod === method.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="text-teal-600"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">{method.name}</span>
                        </div>
                        {method.icon && <method.icon className="w-5 h-5 text-gray-400" />}
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-6 space-y-4">
                      <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry Date" placeholder="MM/YY" />
                        <Input label="CVV" placeholder="123" />
                      </div>
                      <Input label="Name on Card" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-6 text-sm text-gray-500 dark:text-gray-400">
                    <Lock className="w-4 h-4" />
                    Your payment information is secure and encrypted
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button className="flex-1" onClick={handlePlaceOrder} isLoading={isProcessing}>
                      Place Order - {formatPrice(total)}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card padding="lg" className="sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {state.cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images[0] || 'https://images.pexels.com/photos/3482192/pexels-photo-3482192.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
