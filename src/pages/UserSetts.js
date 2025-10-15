import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';

const UserSetts = () => {
  const { user } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
    if (user?.name) return user.name;
    return user?.email || 'User';
  };

  return (
    <div className="App bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <TopNavbar />
      <MainHeader />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">User Settings</h1>
          <p className="text-lg text-white opacity-90 mt-2">
            Manage your profile and preferences
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">

          {/* Profile Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Name:</strong> {getUserDisplayName()}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {user?.email || 'N/A'}
            </p>
          </div>

          {/* Theme Toggle */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="hidden"
              />
              <div className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition`}>
                <div className={`bg-white dark:bg-black w-4 h-4 rounded-full shadow-md transform transition ${darkMode ? 'translate-x-6' : ''}`} />
              </div>
              <span className="ml-3 text-gray-700 dark:text-gray-300">
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </label>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserSetts;
