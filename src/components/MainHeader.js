import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';
import UserProfileDropdown from './UserProfileDropdown';

const MainHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { openSearch } = useSearch();
  const { isAuthenticated } = useAuth();
  // const { darkMode } = useTheme(); // Available for future use

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4 relative transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Brand Decor Logo" 
            className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Brand Decor</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Furniture</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <Link to="/" className="relative text-gray-900 dark:text-white hover:text-orange-500 transition-all duration-300 font-medium group overflow-hidden">
            <span className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              Home
            </span>
            <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-orange-500">
              Home
            </span>
          </Link>
          <Link to="/shop" className="relative text-gray-900 dark:text-white hover:text-orange-500 transition-all duration-300 font-medium group overflow-hidden">
            <span className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              Shop
            </span>
            <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-orange-500">
              Shop
            </span>
          </Link>
          <a href="/about" className="relative text-gray-900 hover:text-orange-500 transition-all duration-300 font-medium group overflow-hidden">
            <span className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              About
            </span>
            <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-orange-500">
              About
            </span>
          </a>
          <a href="/contact" className="relative text-gray-900 hover:text-orange-500 transition-all duration-300 font-medium group overflow-hidden">
            <span className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              Contact
            </span>
            <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-orange-500">
              Contact
            </span>
          </a>
          <a href="/charity" className="relative text-gray-900 hover:text-orange-500 transition-all duration-300 font-medium group overflow-hidden">
            <span className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              Charity
            </span>
            <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-orange-500">
              Charity
            </span>
          </a>
        </nav>

        {/* User Actions + Mobile Menu Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* User Profile or Login */}
          {isAuthenticated() ? (
            <UserProfileDropdown />
          ) : (
            <Link to="/login" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors group">
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="hidden md:inline font-medium">Login</span>
            </Link>
          )}

          {/* Separator */}
          <span className="text-gray-300 hidden md:inline">|</span>

          {/* Search */}
          <button 
            onClick={openSearch}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors group"
          >
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="hidden md:inline">Search</span>
          </button>

          {/* Separator */}
          <span className="text-gray-300 hidden md:inline">|</span>

          {/* Cart */}
          <Link to="/cart" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors relative group">
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 15h2a1 1 0 000 2 1 1 0 00-2-2M19 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" />
              </svg>
              {/* Badge */}
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium group-hover:bg-orange-600 transition-colors">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <span className="hidden md:inline">Cart</span>
          </Link>

          {/* Mobile Menu Toggle - at the end */}
          <button 
            className="lg:hidden flex items-center justify-center w-8 h-8 text-gray-700 hover:text-orange-500 transition-colors ml-2"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu with Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-6">
                <Link 
                  to="/" 
                  className="text-gray-900 hover:text-orange-500 transition-colors font-medium py-3 border-b border-gray-100 hover:pl-2 transform transition-all duration-200 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/shop" 
                  className="text-gray-900 hover:text-orange-500 transition-colors font-medium py-3 border-b border-gray-100 hover:pl-2 transform transition-all duration-200 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-900 hover:text-orange-500 transition-colors font-medium py-3 border-b border-gray-100 hover:pl-2 transform transition-all duration-200 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-900 hover:text-orange-500 transition-colors font-medium py-3 border-b border-gray-100 hover:pl-2 transform transition-all duration-200 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link 
                  to="/charity" 
                  className="text-gray-900 hover:text-orange-500 transition-colors font-medium py-3 border-b border-gray-100 hover:pl-2 transform transition-all duration-200 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Charity
                </Link>
                <Link 
                  to="/cart" 
                  className="text-gray-900 hover:text-orange-500 transition-colors font-medium py-3 border-b border-gray-100 hover:pl-2 transform transition-all duration-200 text-lg flex items-center justify-between"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cart
                  {getTotalItems() > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                {isAuthenticated() ? (
                  <div className="py-3 border-b border-gray-100">
                    <UserProfileDropdown />
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-gray-900 hover:text-orange-500 transition-colors font-medium py-3 hover:pl-2 transform transition-all duration-200 text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
      
      <SearchModal />
    </div>
  );
};

export default MainHeader;
