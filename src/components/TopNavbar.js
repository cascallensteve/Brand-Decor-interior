import React from 'react';

const TopNavbar = () => {
  return (
    <div className="bg-black text-white px-4 py-2 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        {/* Left side - Reviews and Support */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <a href="/reviews" className="relative hover:text-gray-300 transition-all duration-300 group overflow-hidden">
            <span className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              Reviews
            </span>
            <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-gray-300">
              Reviews
            </span>
          </a>
          <span className="text-gray-400">|</span>
          <a href="/support" className="relative hover:text-gray-300 transition-all duration-300 group overflow-hidden">
            <span className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              Support
            </span>
            <span className="absolute top-0 left-0 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-gray-300">
              Support
            </span>
          </a>
        </div>

        {/* Right side - Phone and Email */}
        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 lg:space-x-6">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="text-xs sm:text-sm">(+254) 0714139461</span>
          </div>
          
          <span className="text-gray-400 hidden sm:inline">|</span>
          
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-xs sm:text-sm">sales@branddecorinteriors.co.ke</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
