import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import { LogOut, CheckCircle, ArrowRight } from 'lucide-react';

const Logout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  useEffect(() => {
    // if already logged out, skip to home
    if (!user) {
      navigate('/');
      return;
    }

    if (hasLoggedOut) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);

    const timer = setTimeout(() => {
      logout();
      setHasLoggedOut(true);
      navigate('/');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [logout, navigate, user, hasLoggedOut]);

  const handleLogoutNow = () => {
    if (!hasLoggedOut) {
      logout();
      setHasLoggedOut(true);
      navigate('/');
    }
  };

  const handleStayLoggedIn = () => {
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.name) {
      return user.name;
    }
    return user?.email || 'User';
  };

  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />

      {/* Logout Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
            <a href="/" className="text-white hover:text-orange-200 transition-colors">Home</a>
            <span className="text-white">/</span>
            <span className="text-white font-medium">Logout</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Goodbye!</h1>
          <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
            You have been successfully logged out
          </p>
        </div>
      </div>

      {/* Logout Content */}
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>

              {/* Logout Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Successfully Logged Out
              </h2>

              <p className="text-gray-600 mb-6">
                Thank you for using Brand Decor, {getUserDisplayName()}! 
                You have been successfully logged out of your account.
              </p>

              {/* Auto Redirect Message */}
              {!hasLoggedOut && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    You will be automatically redirected to the home page in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleLogoutNow}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Continue to Home
                </button>

                <button
                  onClick={handleStayLoggedIn}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Back to Home
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Your session has been securely terminated. 
                  To access your account again, please log in.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Quick Links:</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/login" 
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Sign In Again
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a 
                href="/shop" 
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Continue Shopping
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a 
                href="/about" 
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                About Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Logout;
