import React, { useState } from 'react';
import { FaHome, FaBox, FaUsers, FaClipboardList, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', id: 'dashboard', path: '/admin' },
    { icon: <FaBox />, label: 'Products', id: 'products', path: '/admin/products' },
    { icon: <FaUsers />, label: 'Users', id: 'users', path: '/admin/users' },
    { icon: <FaClipboardList />, label: 'Orders', id: 'orders', path: '/admin/orders' },
    { icon: <FaCog />, label: 'Settings', id: 'settings', path: '/admin/settings' },
    { icon: <FaBox />, label: 'Categories', id: 'categories', path: '/admin/categories' },
    { icon: <FaBox />, label: 'SubCategories', id: 'subCategories', path: '/admin/subCategories' },
    { icon: <FaBox />, label: 'Brands', id: 'brands', path: '/admin/brands' },
    { icon: <FaBox />, label: 'Colors', id: 'colors', path: '/admin/colors' },
    { icon: <FaBox />, label: 'Sizes', id: 'sizes', path: '/admin/sizes' },
    { icon: <FaBox />, label: 'Coupons', id: 'coupons', path: '/admin/coupons' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-900 text-white transition duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo192.png" 
              alt="BrandDecor Logo" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold">BrandDecor</span>
          </Link>
          <button 
            onClick={toggleSidebar}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white lg:hidden"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="px-2 py-1">
                <Link
                  to={item.path}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button at the bottom */}
        <div className="absolute bottom-0 w-full border-t border-gray-700 p-4">
          <button className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-300 transition-colors duration-200 hover:bg-gray-800">
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm lg:ml-64">
          <button 
            onClick={toggleSidebar}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <FaBars className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            
            <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=3B82F6&color=fff"
                alt="Admin"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:ml-64">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
