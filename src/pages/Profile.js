import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import { User, Mail, Phone, Calendar, MapPin, Eye, EyeOff, X } from 'lucide-react';
import { forgotPassword, resetPassword } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }

    try {
      setLoading(true);
      if (!passwordData.otp) {
        alert("Please enter the reset code sent to your email.");
        return;
      }

      await resetPassword({
        email: user.email,
        token: passwordData.otp,
        new_password: passwordData.newPassword
      });

      alert("Password changed successfully!");
      setShowChangePasswordModal(false);
      setPasswordData({
        otp: '',
        newPassword: '',
        confirmPassword: ''
      });
      setOtpSent(false);
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setPasswordData({
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
    setOtpSent(false);
  };

  const openChangePasswordModal = async () => {
    setShowChangePasswordModal(true);
    try {
      setOtpSending(true);
      await forgotPassword(user.email);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending reset code:", error);
      alert(error.message || "Failed to send reset code");
    } finally {
      setOtpSending(false);
    }
  };

  const resendOtp = async () => {
    try {
      setOtpSending(true);
      await forgotPassword(user.email);
      setOtpSent(true);
      alert("Reset code sent to your email.");
    } catch (error) {
      console.error("Error resending reset code:", error);
      alert(error.message || "Failed to resend reset code");
    } finally {
      setOtpSending(false);
    }
  };

  if (!user) {
    return (
      <div className="App">
        <TopNavbar />
        <MainHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
            <a href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Go to Login
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.name) {
      return user.name;
    }
    return user?.email || 'User';
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // If admin tries to access client profile, send to admin dashboard
  if (user && (user.userType === 'admin' || user.role === 'admin')) {
    navigate('/admin');
    return null;
  }

  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white text-orange-500 rounded-full flex items-center justify-center font-bold text-3xl mb-4 shadow-lg">
              {getUserInitials()}
            </div>
            
            {/* User Info */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {getUserDisplayName()}
            </h1>
            <p className="text-lg text-white opacity-90">
              Welcome to your profile
            </p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-orange-500" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">
                          {getUserDisplayName()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-900">{user.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                    Account Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-900">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Account Status</p>
                        <p className="font-medium text-green-600">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                    Edit Profile
                  </button>
                  <button 
                    onClick={openChangePasswordModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={() => logout(navigate)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <button
                  onClick={closeChangePasswordModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
                  />
                </div>

                {/* Reset Code (OTP) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={passwordData.otp}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter the code sent to your email"
                    required
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">{otpSent ? "Code sent" : "Send a code to your email"}</span>
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={otpSending}
                      className="text-sm text-orange-600 hover:text-orange-700 disabled:opacity-50"
                    >
                      {otpSending ? "Sending..." : otpSent ? "Resend Code" : "Send Code"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 mt-6"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Confirm New Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors pr-10"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 mt-6"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    A reset code has {otpSent ? '' : 'not '}been sent to your email. Password must be at least 6 characters long.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeChangePasswordModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
