import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If adminOnly is true and user is not admin, redirect to home
  if (adminOnly && !(user?.userType === 'admin' || user?.role === 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
