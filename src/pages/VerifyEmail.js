import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import { verifyEmail, resendVerificationOtp } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmailHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
          <a href="/" className="text-white hover:text-orange-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Verify Email</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Verify Your Email</h1>
        <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
          Enter the 6-digit OTP sent to your email address
        </p>
      </div>
    </div>
  );
};

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      // If accessed directly without email param, send to login/sign up
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await verifyEmail({ email, otp });
      // Persist session via AuthContext and redirect based on role
      authLogin(response.user, response.token);
      alert(response.message || 'Email verified successfully.');
      if (response?.user?.userType === 'admin' || response?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      alert(error.message || 'Failed to verify email');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      alert('Please enter your email first.');
      return;
    }
    try {
      setResending(true);
      const response = await resendVerificationOtp(email);
      alert(response.message || 'Verification code sent successfully.');
    } catch (error) {
      alert(error.message || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />
      <VerifyEmailHeader />

      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h2>
                <p className="text-gray-600">We sent a 6-digit code to {email}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors tracking-widest text-center"
                    placeholder="_ _ _ _ _ _"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  {submitting ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors disabled:opacity-60"
                >
                  {resending ? 'Sending code...' : "Didn't get the code? Resend"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Entered the wrong email?
              <button
                onClick={() => navigate('/login')}
                className="ml-1 text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
