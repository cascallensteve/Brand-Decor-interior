import React from 'react';
import { Navigate } from 'react-router-dom';

const BrowserCheck = ({ children }) => {
  // Browser restriction removed - allow access from any browser
  return children;
};

export default BrowserCheck;
