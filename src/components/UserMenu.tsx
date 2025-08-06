import React, { useState } from 'react';
import { User, LogIn, UserPlus, Settings, Heart, Package, LogOut, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const UserMenu = () => {
  const { state, dispatch } = useApp();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: loginData.email,
      isLoggedIn: true
    };
    dispatch({ type: 'SET_USER', payload: mockUser });
    setShowLoginForm(false);
    setLoginData({ email: '', password: '' });
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
  };

  if (!state.isUserMenuOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
      {!state.user ? (
        // Not logged in
        <div className="p-6">
          {!showLoginForm ? (
            <div className="space-y-4">
              <div className="text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Welcome!</h3>
                <p className="text-gray-600">Sign in to access your account</p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </div>
          ) : (
            // Login form
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Sign In</h3>
                <button
                  onClick={() => setShowLoginForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        // Logged in
        <div className="p-4">
          <div className="flex items-center space-x-3 pb-4 border-b">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{state.user.name}</p>
              <p className="text-sm text-gray-600">{state.user.email}</p>
            </div>
          </div>
          
          <div className="py-2">
            <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
            
            <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </button>
            
            <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
              <Heart className="w-4 h-4" />
              <span>Wishlist ({state.wishlist.length})</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-3 mt-2 border-t pt-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;