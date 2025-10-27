import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import WelcomeModal from '../components/WelcomeModal';
import SignupSuccessModal from '../components/SignupSuccessModal';
import PublicRoute from '../components/PublicRoute';
import { useAuth } from '../context/AuthContext';
import { signUp, login, adminSignUp } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // ✅ install lucide-react for icons
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
          <a href="/" className="text-white hover:text-orange-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Login</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Welcome Back</h1>
        <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
          Sign in to your account to access your cart and order history
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁 toggle for password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👁 toggle for confirm
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState({ name: '', email: '' });
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isLogin) {
        const response = await login({
          email: formData.email,
          password: formData.password,
        });

        console.log("Login Success:", response);

        // Use AuthContext to store user data
        authLogin(response.user, response.token);

        // If admin and not verified, force email verification
        if ((response.user.userType === 'admin' || response.user.role === 'admin') && !response.user.is_email_verified) {
          navigate(`/verify-email?email=${encodeURIComponent(response.user.email)}`);
          return;
        }

        // Check if user is admin and redirect accordingly
        if (response.user.userType === 'admin' || response.user.role === 'admin') {
          navigate('/admin');
          return;
        }

        // Show welcome modal for regular users
        setWelcomeUser({
          name: response.user.first_name || response.user.name || 'User',
          email: response.user.email
        });
        setShowWelcomeModal(true);
        toast.success('Signed in successfully!', { autoClose: 3000 });

      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match!', { autoClose: 4000 });
          return;
        }

        const response = await signUp(formData);
        console.log("Sign Up Success:", response);
        setSignupEmail(formData.email);
        setShowSignupSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message || 'Something went wrong. Please try again.', { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
    // Navigate to home page after welcome modal closes
    navigate('/');
  };

  const handleSignupSuccessClose = () => {
    setShowSignupSuccess(false);
    navigate(`/verify-email?email=${encodeURIComponent(signupEmail)}`);
  };

  return (
    <PublicRoute>
      <div className="App">
        <TopNavbar />
        <MainHeader />
        <LoginHeader />
      
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  isLogin 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  !isLogin 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h2>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Enter your credentials to access your account' 
                    : 'Join us to start shopping for beautiful furniture'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          required={!isLogin}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="+254 700 123 456"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Password with toggle */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
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

                {!isLogin && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-10"
                      placeholder="••••••••"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 mt-6"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => navigate('/forgot-password')}
                      className="text-sm text-orange-500 hover:text-orange-600 transition-colors focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors touch-manipulation"
                >
                  {loading ? "Please wait..." : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>
              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>

              {/* Terms and Privacy */}
              {!isLogin && (
                <p className="mt-6 text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{' '}
                  <button type="button" className="text-orange-500 hover:text-orange-600 focus:outline-none">Terms of Service</button>{' '}
                  and{' '}
                  <button type="button" className="text-orange-500 hover:text-orange-600 focus:outline-none">Privacy Policy</button>
                </p>
              )}
            </div>
          </div>

          {/* Toggle Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeModalClose}
        userName={welcomeUser.name}
        userEmail={welcomeUser.email}
      />
      <SignupSuccessModal
        isOpen={showSignupSuccess}
        onClose={handleSignupSuccessClose}
        email={signupEmail}
      />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
    </PublicRoute>
  );
};

export default Login;
