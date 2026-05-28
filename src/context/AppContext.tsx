import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Product, CartItem, WishlistItem, Address, Order, Theme, Category } from '@/types';
import { generateOrderNumber } from '@/utils/helpers';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  wishlist: WishlistItem[];
  addresses: Address[];
  orders: Order[];
  theme: Theme;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  searchQuery: string;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FEATURED_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_WISHLIST'; payload: WishlistItem[] }
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_ADDRESSES'; payload: Address[] }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: Address }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_CART' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  products: [],
  featuredProducts: [],
  categories: [],
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  wishlist: [],
  addresses: [],
  orders: [],
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  searchQuery: '',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_FEATURED_PRODUCTS':
      return { ...state, featuredProducts: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_CART': {
      const cart = action.payload;
      const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { ...state, cart, cartCount, cartTotal };
    }
    case 'ADD_TO_CART': {
      const existingIndex = state.cart.findIndex((item) => item.product_id === action.payload.product.id);
      let newCart: CartItem[];
      if (existingIndex >= 0) {
        newCart = state.cart.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item
        );
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          user_id: state.user?.id || null,
          product_id: action.payload.product.id,
          quantity: action.payload.quantity,
          product: action.payload.product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        newCart = [...state.cart, newItem];
      }
      const cartCount = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const cartTotal = newCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { ...state, cart: newCart, cartCount, cartTotal };
    }
    case 'UPDATE_CART_ITEM': {
      const newCart = state.cart.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      ).filter((item) => item.quantity > 0);
      const cartCount = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const cartTotal = newCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { ...state, cart: newCart, cartCount, cartTotal };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter((item) => item.id !== action.payload);
      const cartCount = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const cartTotal = newCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { ...state, cart: newCart, cartCount, cartTotal };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [], cartCount: 0, cartTotal: 0 };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'ADD_TO_WISHLIST':
      if (state.wishlist.some((item) => item.product_id === action.payload.product_id)) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter((item) => item.id !== action.payload) };
    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload };
    case 'ADD_ADDRESS':
      return { ...state, addresses: [...state.addresses, action.payload] };
    case 'UPDATE_ADDRESS':
      return { ...state, addresses: state.addresses.map((addr) => (addr.id === action.payload.id ? action.payload : addr)) };
    case 'DELETE_ADDRESS':
      return { ...state, addresses: state.addresses.filter((addr) => addr.id !== action.payload) };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'SET_THEME': {
      localStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };
    }
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen, isSearchOpen: false, isMobileMenuOpen: false };
    case 'TOGGLE_SEARCH':
      return { ...state, isSearchOpen: !state.isSearchOpen, isCartOpen: false, isMobileMenuOpen: false };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen, isCartOpen: false, isSearchOpen: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCartWithDatabase: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  addAddress: (address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<Order | null>;
  fetchProducts: (filters?: Record<string, unknown>) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchUserOrders: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) dispatch({ type: 'SET_USER', payload: session.user as unknown as User });
        else dispatch({ type: 'SET_LOADING', payload: false });
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    initAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) dispatch({ type: 'SET_USER', payload: session.user as unknown as User });
      else dispatch({ type: 'SET_USER', payload: null });
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (state.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state.theme]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'SET_WISHLIST', payload: [] });
    dispatch({ type: 'SET_ADDRESSES', payload: [] });
    dispatch({ type: 'SET_ORDERS', payload: [] });
  }, []);

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    if (state.isAuthenticated && state.user) {
      const { error } = await supabase.from('cart_items').insert({ user_id: state.user.id, product_id: product.id, quantity });
      if (error) {
        const { data: existingItem } = await supabase.from('cart_items').select('*').eq('user_id', state.user.id).eq('product_id', product.id).single();
        if (existingItem) await supabase.from('cart_items').update({ quantity: existingItem.quantity + quantity }).eq('id', existingItem.id);
      }
    }
  }, [state.isAuthenticated, state.user]);

  const updateCartItem = useCallback(async (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity } });
    if (state.isAuthenticated) {
      if (quantity > 0) await supabase.from('cart_items').update({ quantity }).eq('id', id);
      else await supabase.from('cart_items').delete().eq('id', id);
    }
  }, [state.isAuthenticated]);

  const removeFromCart = useCallback(async (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    if (state.isAuthenticated) await supabase.from('cart_items').delete().eq('id', id);
  }, [state.isAuthenticated]);

  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (state.isAuthenticated && state.user) await supabase.from('cart_items').delete().eq('user_id', state.user.id);
  }, [state.isAuthenticated, state.user]);

  const syncCartWithDatabase = useCallback(async () => {
    if (!state.isAuthenticated || !state.user) return;
    const { data } = await supabase.from('cart_items').select('*, product:products(*)').eq('user_id', state.user.id);
    if (data) dispatch({ type: 'SET_CART', payload: data as CartItem[] });
  }, [state.isAuthenticated, state.user]);

  const toggleWishlist = useCallback(async (product: Product) => {
    const existingItem = state.wishlist.find((item) => item.product_id === product.id);
    if (existingItem) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: existingItem.id });
      if (state.isAuthenticated) await supabase.from('wishlists').delete().eq('id', existingItem.id);
    } else {
      const newItem: WishlistItem = { id: crypto.randomUUID(), user_id: state.user?.id || '', product_id: product.id, product, created_at: new Date().toISOString() };
      dispatch({ type: 'ADD_TO_WISHLIST', payload: newItem });
      if (state.isAuthenticated && state.user) {
        const { data } = await supabase.from('wishlists').insert({ user_id: state.user.id, product_id: product.id }).select().single();
        if (data) {
          dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: newItem.id });
          dispatch({ type: 'ADD_TO_WISHLIST', payload: { ...newItem, id: data.id } });
        }
      }
    }
  }, [state.wishlist, state.isAuthenticated, state.user]);

  const isInWishlist = useCallback((productId: string) => state.wishlist.some((item) => item.product_id === productId), [state.wishlist]);

  const addAddress = useCallback(async (address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => {
    if (!state.user) return;
    const { data } = await supabase.from('addresses').insert({ user_id: state.user.id, ...address }).select().single();
    if (data) dispatch({ type: 'ADD_ADDRESS', payload: data as Address });
  }, [state.user]);

  const updateAddress = useCallback(async (address: Address) => {
    const { data } = await supabase.from('addresses').update(address).eq('id', address.id).select().single();
    if (data) dispatch({ type: 'UPDATE_ADDRESS', payload: data as Address });
  }, []);

  const deleteAddress = useCallback(async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    dispatch({ type: 'DELETE_ADDRESS', payload: id });
  }, []);

  const createOrder = useCallback(async (orderData: Partial<Order>): Promise<Order | null> => {
    if (!state.user) return null;
    const order: Order = {
      id: crypto.randomUUID(),
      order_number: generateOrderNumber(),
      user_id: state.user.id,
      status: 'pending',
      payment_status: 'pending',
      payment_method: orderData.payment_method || null,
      subtotal: state.cartTotal,
      shipping_cost: orderData.shipping_cost || 0,
      tax: orderData.tax || 0,
      discount: orderData.discount || 0,
      total: state.cartTotal + (orderData.shipping_cost || 0) + (orderData.tax || 0) - (orderData.discount || 0),
      currency: 'USD',
      shipping_address_id: orderData.shipping_address_id || null,
      billing_address_id: orderData.billing_address_id || null,
      notes: orderData.notes || null,
      tracking_number: null,
      tracking_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: state.cart.map((item) => ({
        id: crypto.randomUUID(),
        order_id: '',
        product_id: item.product_id,
        product_name: item.product.name,
        product_sku: item.product.sku,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
        product_image: item.product.images[0] || null,
      })),
    };
    const { data, error } = await supabase.from('orders').insert({
      order_number: order.order_number,
      user_id: order.user_id,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      shipping_address_id: order.shipping_address_id,
      billing_address_id: order.billing_address_id,
      notes: order.notes,
    }).select().single();
    if (error || !data) return null;
    const orderItems = state.cart.map((item) => ({
      order_id: data.id,
      product_id: item.product_id,
      product_name: item.product.name,
      product_sku: item.product.sku,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity,
      product_image: item.product.images[0] || null,
    }));
    await supabase.from('order_items').insert(orderItems);
    await clearCart();
    dispatch({ type: 'ADD_ORDER', payload: { ...order, id: data.id } as Order });
    return { ...order, id: data.id };
  }, [state.user, state.cart, state.cartTotal, clearCart]);

  const fetchProducts = useCallback(async (filters?: Record<string, unknown>) => {
    let query = supabase.from('products').select('*, category:categories(*)').eq('is_active', true);
    if (filters?.category) query = query.eq('category_id', filters.category);
    if (filters?.isFeatured) query = query.eq('is_featured', true);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);
    const { data } = await query.order('created_at', { ascending: false });
    if (data) dispatch({ type: 'SET_PRODUCTS', payload: data as Product[] });
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');
    if (data) dispatch({ type: 'SET_CATEGORIES', payload: data as Category[] });
  }, []);

  const fetchUserOrders = useCallback(async () => {
    if (!state.user) return;
    const { data } = await supabase.from('orders').select('*, items:order_items(*)').eq('user_id', state.user.id).order('created_at', { ascending: false });
    if (data) dispatch({ type: 'SET_ORDERS', payload: data as Order[] });
  }, [state.user]);

  const value: AppContextType = {
    state, dispatch, signIn, signUp, signOut, addToCart, updateCartItem, removeFromCart, clearCart, syncCartWithDatabase,
    toggleWishlist, isInWishlist, addAddress, updateAddress, deleteAddress, createOrder, fetchProducts, fetchCategories, fetchUserOrders,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
