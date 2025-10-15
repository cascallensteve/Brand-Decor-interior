import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const API_BASE_URL = "https://brand-decor-ecom-api.vercel.app";

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
    const wasAdmin = user && (user.userType === 'admin' || user.role === 'admin');
    
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUser(null);
    
    // If navigate function is provided, redirect based on user type
    if (navigate) {
      if (wasAdmin) {
        navigate('/admin/logout');
      } else {
        navigate('/logout');
      }
    } else {
      // Fallback: navigate via location to ensure redirect even outside Router context
      if (typeof window !== 'undefined') {
        if (wasAdmin) {
          window.location.href = '/admin/logout';
        } else {
          window.location.href = '/logout';
        }
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

  // Admin login function - uses same endpoint as regular login
  const adminLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      // Check if user is admin based on response data
      // Based on API response format: userType can be "client" or "admin"
      const isAdmin = data.user?.userType === 'admin' || 
                     data.user?.role === 'admin' || 
                     data.user?.user_type === 'admin' ||
                     data.user?.is_admin === true;

      if (!isAdmin) {
        return { success: false, message: "Access denied. Admin privileges required." };
      }

      // Set user as admin and store token
      const adminUser = {
        ...data.user,
        userType: 'admin',
        role: 'admin',
        is_admin: true,
        token: data.token
      };

      login(adminUser, data.token);
      return { success: true, user: adminUser };
      
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, message: error.message || "Login failed" };
    }
  };

  // Admin signup function
  const adminSignUp = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone_number: userData.phone,
          password: userData.password,
          user_type: 'admin'
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, message: data.message || "Signup failed" };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Admin signup error:', error);
      return { success: false, message: error.message || "Signup failed" };
    }
  };

  const value = {
    user,
    loading,
    login, // Use the regular login function
    logout,
    isAuthenticated,
    isAdmin,
    refreshUserSession,
    getToken,
    adminLogin, // Keep adminLogin as separate function
    adminSignUp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
