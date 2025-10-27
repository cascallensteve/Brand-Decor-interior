import React, { useState, useEffect } from 'react';
import { FaHome, FaBox, FaUsers, FaClipboardList, FaCog, FaBell, FaSignOutAlt, FaBars, FaTimes, FaUserCircle, FaQuestionCircle, FaEnvelope, FaChevronDown, FaComments, FaHeart } from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    navigate('/admin/logout');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { icon: <FaHome />, label: 'Dashboard', id: 'dashboard', path: '/admin' },
    { icon: <FaBox />, label: 'Products', id: 'products', path: '/admin/products' },
    { icon: <FaUsers />, label: 'Users', id: 'users', path: '/admin/users' },
    { icon: <FaClipboardList />, label: 'Orders', id: 'orders', path: '/admin/orders' },
    { icon: <FaBox />, label: 'Categories', id: 'categories', path: '/admin/categories' },
    { icon: <FaComments />, label: 'Contacts', id: 'contacts', path: '/admin/contacts' },
    { icon: <FaEnvelope />, label: 'Newsletter', id: 'newsletter', path: '/admin/newsletter' },
    { icon: <FaHeart />, label: 'Charity', id: 'charity', path: '/admin/charity' },
    { icon: <FaCog />, label: 'Settings', id: 'settings', path: '/admin/settings' },
  ]
  const notifications = [
    { id: 1, title: 'New order received', time: '2m ago' },
    { id: 2, title: 'Low stock: 3 items', time: '1h ago' },
    { id: 3, title: 'New user signed up', time: '3h ago' },
  ];

  const getUserInitials = () => {
    const first = user?.first_name || user?.name?.split(' ')[0] || '';
    const last = user?.last_name || user?.name?.split(' ')[1] || '';
    const initials = `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
    return initials || 'AD';
  };

  const displayName = () => {
    if (user?.first_name || user?.last_name) {
      return `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
    }
    return user?.name || user?.email || 'Admin';
  };

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
              src="/logo.png" 
              alt="Brand Decor Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold">Brand Decor</span>
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
          <button onClick={handleLogout} className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-gray-300 transition-colors duration-200 hover:bg-gray-800">
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header 
          className="flex h-24 items-center justify-between border-b border-gray-200 px-6 shadow-sm lg:ml-64 bg-cover bg-center relative"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 50%, rgba(4, 120, 87, 0.9) 100%), url(https://res.cloudinary.com/djksfayfu/image/upload/v1758518877/6248154_esmkro.jpg)',
            backgroundBlendMode: 'multiply'
          }}
        >
          {/* Left side - Timer and Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Date and Time Display */}
            <div className="hidden sm:flex flex-col items-start px-4 py-2 border-r border-gray-300">
              <div className="text-sm font-semibold text-white">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-lg font-bold text-yellow-300">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </div>
            </div>

            <button 
              onClick={toggleSidebar}
              className="rounded-md p-2 text-white hover:bg-white hover:bg-opacity-20 lg:hidden"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white bg-opacity-90"
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
            
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative rounded-full p-2 text-white hover:bg-white hover:bg-opacity-20"
                aria-label="Notifications"
              >
                <FaBell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b px-4 py-2">
                    <span className="text-sm font-semibold">Notifications</span>
                    <button onClick={() => setIsNotifOpen(false)} className="text-xs text-blue-600 hover:underline">Close</button>
                  </div>
                  <ul className="max-h-64 overflow-auto py-2">
                    {notifications.map((n) => (
                      <li key={n.id} className="px-4 py-2 hover:bg-gray-50">
                        <p className="text-sm text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500">{n.time}</p>
                      </li>
                    ))}
                    {notifications.length === 0 && (
                      <li className="px-4 py-6 text-center text-sm text-gray-500">No notifications</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 rounded-lg border border-white bg-white bg-opacity-20 px-2 py-1 hover:bg-opacity-30 text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {getUserInitials()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-white leading-tight">{displayName()}</div>
                  <div className="text-xs text-gray-100 -mt-0.5">{user?.userType || 'admin'}</div>
                </div>
                <FaChevronDown className="h-3.5 w-3.5 text-white" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">{displayName()}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="px-2 py-2">
                    <Link to="/admin/profile" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</Link>
                    <button onClick={handleLogout} className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                </div>
              )}
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
