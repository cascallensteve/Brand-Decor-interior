import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import { resetPassword } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
          <a href="/" className="text-white hover:text-orange-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Reset Password</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Reset Your Password</h1>
        <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
          Enter your email, reset token, and new password
        </p>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [formData, setFormData] = useState({
    email: initialEmail,
    token: '',
    new_password: '',
    confirm_password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!formData.email) {
      // If accessed directly without email param, send to login
      navigate('/login');
    }
  }, [formData.email, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      toast.error('Passwords do not match!', {
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

    if (formData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters long!', {
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
      setSubmitting(true);
      console.log('🔐 Resetting password for email:', formData.email);
      
      const response = await resetPassword({
        email: formData.email,
        token: formData.token,
        new_password: formData.new_password
      });
      
      console.log('✅ Password reset response:', response);
      
      toast.success(response.message || 'Password reset successfully!', {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#065F46',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      
      // Navigate to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Password reset error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.', {
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
      setSubmitting(false);
    }
  };

  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />
      <ResetPasswordHeader />

      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your details to reset your password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reset Token</label>
                  <input
                    type="text"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors tracking-widest text-center"
                    placeholder="Enter reset token"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 mt-6"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 mt-6"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
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

export default ResetPassword;
