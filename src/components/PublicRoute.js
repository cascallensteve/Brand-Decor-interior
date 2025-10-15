import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children, redirectTo = "/" }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Avoid redirect decisions while loading to prevent loops
  if (loading) {
    return null;
  }

  // If user is authenticated, redirect to appropriate page
  if (isAuthenticated()) {
    // If user is admin, redirect to admin dashboard
    if (!user) {
      // Wait for user to load before redirecting; prevents bouncing
      return null;
    }
    if (user?.userType === 'admin' || user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    // Otherwise redirect to home or specified page
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
