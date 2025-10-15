import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSignOutAlt, FaSpinner, FaHome, FaShieldAlt, FaUser } from 'react-icons/fa';

const AdminLogout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [logoutComplete, setLogoutComplete] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        toast.success('Admin logged out successfully');
        setLogoutComplete(true);
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout');
        setLogoutComplete(true);
      } finally {
        setIsLoggingOut(false);
      }
    };

    // Add a small delay to show the logout screen
    const timer = setTimeout(handleLogout, 1500);
    
    return () => clearTimeout(timer);
  }, [logout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <FaSignOutAlt className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isLoggingOut ? 'Logging Out' : 'Admin Logout Complete'}
          </h2>
          <p className="mt-2 text-gray-300">
            {isLoggingOut 
              ? (user?.first_name ? `Goodbye, ${user.first_name}!` : 'Goodbye, Admin!')
              : 'Your admin session has been terminated securely.'
            }
          </p>
          {isLoggingOut && (
            <p className="text-sm text-gray-400 mt-1">
              You are being securely logged out of the admin panel...
            </p>
          )}
        </div>
        
        {isLoggingOut ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin h-8 w-8 text-orange-400" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  What would you like to do next?
                </h3>
                <p className="text-sm text-gray-600">
                  Choose your next destination below
                </p>
              </div>
              
              <div className="grid gap-4">
                {/* Admin Login Button */}
                <button
                  onClick={() => navigate('/admin-login')}
                  className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors shadow-sm"
                >
                  <FaShieldAlt className="mr-3 h-5 w-5" />
                  Admin Login / Create Admin Account
                </button>
                
                {/* Client Login Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors shadow-sm"
                >
                  <FaUser className="mr-3 h-5 w-5" />
                  Client Login
                </button>
                
                {/* Home Page Button */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center px-6 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors shadow-sm"
                >
                  <FaHome className="mr-3 h-5 w-5" />
                  Browse Store
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  All administrative privileges have been revoked for security.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogout;
