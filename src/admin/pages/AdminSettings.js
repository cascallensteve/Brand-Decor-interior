import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { PageBanner } from '../../admin';
import { 
  FaCog, 
  FaSave, 
  FaStore, 
  FaDollarSign, 
  FaLock, 
  FaBell, 
  FaUserCog, 
  FaInfoCircle,
  FaDatabase,
  FaChartBar,
  FaShieldAlt,
  FaEnvelope,
  FaGlobe,
  FaPalette,
  FaTools,
  FaUserPlus
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function AdminSettings() {
  const { user } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Brand Decor',
    siteDescription: 'Premium Home Decor & Furniture',
    adminEmail: user?.email || '',
    timezone: 'Africa/Nairobi',
    language: 'en',
    
    // Store Settings
    currency: 'KES',
    taxRate: 16,
    enableTaxes: true,
    shippingEnabled: true,
    freeShippingThreshold: 5000,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    systemAlerts: true,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: 'daily',
    
    // Theme Settings
    adminTheme: darkMode ? 'dark' : 'light',
    brandColor: '#f97316',
    
    // Analytics
    trackingEnabled: true,
    analyticsProvider: 'google',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, adminTheme: theme }));
    setDarkMode(theme === 'dark');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    toast.success('Admin settings saved successfully!');
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <FaCog className="mr-2" /> },
    { id: 'store', name: 'Store Config', icon: <FaStore className="mr-2" /> },
    { id: 'security', name: 'Security', icon: <FaShieldAlt className="mr-2" /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell className="mr-2" /> },
    { id: 'system', name: 'System', icon: <FaDatabase className="mr-2" /> },
    { id: 'theme', name: 'Appearance', icon: <FaPalette className="mr-2" /> },
    { id: 'analytics', name: 'Analytics', icon: <FaChartBar className="mr-2" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">General Settings</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Basic site configuration and information.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Description</label>
                <textarea
                  name="siteDescription"
                  rows={3}
                  value={settings.siteDescription}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                <select
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                >
                  <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="Europe/London">London Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'store':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Store Configuration</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure store settings, currency, and shipping.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                >
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax Rate (%)</label>
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Free Shipping Threshold</label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={settings.freeShippingThreshold}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableTaxes"
                    checked={settings.enableTaxes}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Taxes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="shippingEnabled"
                    checked={settings.shippingEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Shipping</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure notification preferences.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</div>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Order Notifications</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Get notified about new orders</div>
                </div>
                <input
                  type="checkbox"
                  name="orderNotifications"
                  checked={settings.orderNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Low Stock Alerts</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Alert when stock is running low</div>
                </div>
                <input
                  type="checkbox"
                  name="lowStockAlerts"
                  checked={settings.lowStockAlerts}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">System Alerts</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Receive system and security alerts</div>
                </div>
                <input
                  type="checkbox"
                  name="systemAlerts"
                  checked={settings.systemAlerts}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure security and authentication settings.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Session Timeout (minutes)</label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  min="5"
                  max="480"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Login Attempts</label>
                <input
                  type="number"
                  name="loginAttempts"
                  value={settings.loginAttempts}
                  onChange={handleChange}
                  min="3"
                  max="10"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Two-Factor Authentication</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Customize the admin panel appearance.</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 border-2 rounded-lg text-left ${
                      settings.adminTheme === 'light'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">Light Theme</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Clean and bright interface</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 border-2 rounded-lg text-left ${
                      settings.adminTheme === 'dark'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">Dark Theme</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Easy on the eyes</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Settings</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">System maintenance and performance settings.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Maintenance Mode</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Temporarily disable site for maintenance</div>
                </div>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Debug Mode</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Enable detailed error logging</div>
                </div>
                <input
                  type="checkbox"
                  name="debugMode"
                  checked={settings.debugMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-md bg-orange-50 dark:bg-orange-900/20 p-4">
            <div className="flex">
              <FaInfoCircle className="h-5 w-5 text-orange-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">Select a setting category</h3>
                <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                  Choose a category from the sidebar to view and edit settings.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Configure your admin panel and store settings
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/auth')}
            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <FaUserPlus className="mr-2" />
            Create Admin
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center w-full rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="mt-6 lg:mt-0 lg:col-span-9">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="p-6">
                {renderTabContent()}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <FaSave className="mr-2 h-4 w-4" />
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
