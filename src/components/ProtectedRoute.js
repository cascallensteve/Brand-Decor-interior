import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // While auth status is loading, render nothing (or a small placeholder) to prevent redirect loops
  if (loading) {
    return null;
  }

  // If user is not authenticated (no token), redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If adminOnly is true but user object not yet loaded, wait (prevents loop)
  if (adminOnly && !user) {
    return null;
  }

  // If adminOnly is true and user is not admin, redirect to home
  if (adminOnly && user && !(user?.userType === 'admin' || user?.role === 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
