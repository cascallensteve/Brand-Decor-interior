import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import PublicRoute from '../components/PublicRoute';
import { adminSignUp } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminSignupHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 py-12 sm:py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
          <a href="/" className="text-white hover:text-indigo-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Admin Sign Up</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Create Admin Account</h1>
        <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
          Register an admin account to access the dashboard (email verification required)
        </p>
      </div>
    </div>
  );
};

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await adminSignUp(formData);
      alert(response.message || 'Admin account created. Please verify your email.');
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      alert(error.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="App">
        <TopNavbar />
        <MainHeader />
        <AdminSignupHeader />

        <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
          <div className="max-w-md mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Registration</h2>
                  <p className="text-gray-600">Admins must verify their email to access the dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="254112907003"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Please wait...' : 'Create Admin Account'}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-6 text-xs text-gray-500 text-center">
              By creating an account, you agree to our
              <button type="button" className="ml-1 text-indigo-600 hover:text-indigo-700 focus:outline-none">Terms</button>
              and
              <button type="button" className="ml-1 text-indigo-600 hover:text-indigo-700 focus:outline-none">Privacy Policy</button>
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </PublicRoute>
  );
};

export default AdminSignup;


