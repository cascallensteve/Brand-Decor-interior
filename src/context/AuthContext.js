import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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
  const [lastActivity, setLastActivity] = useState(Date.now());
  const timeoutRef = useRef(null);
  
  // Auto logout after 15 minutes of inactivity
  const AUTO_LOGOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('adminToken');
        const userToken = localStorage.getItem('userToken');
        const userData = localStorage.getItem('user');
        
        // Check if we have any valid token and user data
        const hasValidToken = token || adminToken || userToken;
        
        if (hasValidToken && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else if (userData && !hasValidToken) {
          // User data exists but no token - clear invalid session
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    // Store token based on user type
    if (userData.userType === 'admin' || userData.role === 'admin') {
      localStorage.setItem('adminToken', token);
      localStorage.removeItem('userToken'); // Clear user token if exists
    } else {
      localStorage.setItem('userToken', token);
      localStorage.removeItem('adminToken'); // Clear admin token if exists
    }
    
    // Keep legacy token for backward compatibility
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setLastActivity(Date.now());
  };

  const logout = (navigate = null) => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUser(null);
    
    // If navigate function is provided, redirect to logout page
    if (navigate) {
      navigate('/logout');
    } else {
      // Fallback: navigate via location to ensure redirect even outside Router context
      if (typeof window !== 'undefined') {
        window.location.href = '/logout';
      }
    }
  };

  const isAuthenticated = () => {
    // Treat presence of any token as authenticated to avoid flicker/loops while user loads
    const hasToken = !!localStorage.getItem('token') || 
                     !!localStorage.getItem('adminToken') || 
                     !!localStorage.getItem('userToken');
    return hasToken;
  };

  // Determine if the current user has admin role
  const isAdmin = () => {
    return !!user && (user.userType === 'admin' || user.role === 'admin');
  };

  // Refresh user state from localStorage (used by some admin pages)
  const refreshUserSession = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return false;
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      return true;
    } catch (e) {
      console.error('Failed to refresh session', e);
      return false;
    }
  };

  // Get the appropriate token for the current user type
  const getToken = () => {
    if (user?.userType === 'admin' || user?.role === 'admin') {
      return localStorage.getItem('adminToken') || localStorage.getItem('token');
    } else {
      return localStorage.getItem('userToken') || localStorage.getItem('token');
    }
  };

  // Inactivity tracking: update lastActivity on user interactions
  useEffect(() => {
    const activityHandler = () => setLastActivity(Date.now());

    window.addEventListener('mousemove', activityHandler);
    window.addEventListener('keydown', activityHandler);
    window.addEventListener('click', activityHandler);
    window.addEventListener('scroll', activityHandler, { passive: true });
    window.addEventListener('touchstart', activityHandler, { passive: true });

    return () => {
      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keydown', activityHandler);
      window.removeEventListener('click', activityHandler);
      window.removeEventListener('scroll', activityHandler);
      window.removeEventListener('touchstart', activityHandler);
    };
  }, []);

  // Start/refresh inactivity timer when auth state or lastActivity changes
  useEffect(() => {
    // Clear any existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only track inactivity when authenticated
    if (isAuthenticated()) {
      const timeSinceActivity = Date.now() - lastActivity;
      const remaining = Math.max(AUTO_LOGOUT_TIME - timeSinceActivity, 0);

      timeoutRef.current = setTimeout(() => {
        logout();
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, lastActivity]);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    refreshUserSession,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
