import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children, redirectTo = "/" }) => {
  const { user, isAuthenticated } = useAuth();

  // If user is authenticated, redirect to appropriate page
  if (isAuthenticated()) {
    // If user is admin, redirect to admin dashboard
    if (user?.userType === 'admin' || user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    // Otherwise redirect to home or specified page
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
