import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      // Normalize role on refresh
      const plan = (storedUser.subscriptionPlan || storedUser.subscription_plan || '').toUpperCase();
      const role = (storedUser.role || '').toUpperCase();
      
      if (plan === 'PREMIUM' && role !== 'ROLE_ADMIN') {
        storedUser.role = 'ROLE_PREMIUM';
      }
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    
    // Normalize role based on subscription plan
    const plan = (userData.subscriptionPlan || userData.subscription_plan || '').toUpperCase();
    const role = (userData.role || '').toUpperCase();
    
    // Always store role in uppercase for consistency
    userData.role = role;
    
    if (userData && plan === 'PREMIUM' && role !== 'ROLE_ADMIN') {
      userData.role = 'ROLE_PREMIUM';
    }
    
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    loading,
    isLoggedIn: !!user
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
