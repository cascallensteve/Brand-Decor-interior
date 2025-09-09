import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import { forgotPassword } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
          <a href="/" className="text-white hover:text-orange-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Forgot Password</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Forgot Your Password?</h1>
        <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
          No worries! Enter your email address and we'll send you a reset code
        </p>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState(() => {
    try {
      if (user?.email) return user.email;
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.email || '';
      }
    } catch (_) {}
    return '';
  });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Auto-fill with registered email if available, but keep editable
  useEffect(() => {
    if (!email) {
      if (user?.email) {
        setEmail(user.email);
        return;
      }
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed?.email) {
            setEmail(parsed.email);
          }
        }
      } catch (_) {
        // ignore
      }
    }
  }, [user, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address', {
        position: "top-right",
        autoClose: 4000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      return;
    }

    try {
      setLoading(true);
      console.log('🔐 Sending forgot password request for email:', email);
      
      const response = await forgotPassword(email);
      console.log('✅ Forgot password response:', response);
      
      setEmailSent(true);
      
      toast.success(response.message || 'Password reset code sent to your email!', {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#065F46',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      toast.error(error.message || 'Failed to send reset code. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToReset = () => {
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />
      <ForgotPasswordHeader />

      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              {!emailSent ? (
                <>
                  <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                    <p className="text-gray-600">
                      Enter your email address and we'll send you a code to reset your password
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder={email || 'your@email.com'}
                        required
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending Reset Code...
                        </div>
                      ) : (
                        'Send Reset Code'
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                    <p className="text-gray-600 mb-4">
                      We've sent a password reset code to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      The code is valid for 15 minutes. Please check your email and spam folder.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleContinueToReset}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                      Continue to Reset Password
                    </button>
                    
                    <button
                      onClick={handleBackToLogin}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?
              <button
                onClick={() => navigate('/login')}
                className="ml-1 text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ForgotPassword;
