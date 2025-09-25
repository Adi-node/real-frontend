import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as loginService, 
  logout as logoutService, 
  register as registerService,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  getUser
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      if (initialized) return;
      
      setLoading(true);
      
      try {
        if (isAuthenticated()) {
          const storedUser = getUser();
          setUser(storedUser);
          
          // Optionally fetch fresh user data
          try {
            const result = await getCurrentUser();
            if (result.success) {
              setUser(result.user);
            }
          } catch (error) {
            console.warn('Failed to fetch fresh user data:', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [initialized]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await loginService(email, password);
      if (result.success) {
        setUser(result.user);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName) => {
    setLoading(true);
    try {
      const result = await registerService(email, password, fullName);
      if (result.success) {
        setUser(result.user);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
    } catch (error) {
      console.warn('Logout service error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!isAuthenticated()) return;
    
    try {
      const result = await getCurrentUser();
      if (result.success) {
        setUser(result.user);
      }
    } catch (error) {
      console.warn('Failed to refresh user data:', error);
    }
  };

  // Helper functions
  const isLoggedIn = () => user !== null;
  const isUserAdmin = () => user?.role === 'admin';
  const hasRole = (role) => user?.role === role;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUserData,
    isLoggedIn,
    isAdmin: isUserAdmin,
    hasRole,
    isAuthenticated: isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;