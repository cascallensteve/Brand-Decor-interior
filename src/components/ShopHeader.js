import React from 'react';

const ShopHeader = () => {
  return (
    <section
      className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.2)), 
          url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 z-10">
        <button className="flex items-center space-x-2 bg-black bg-opacity-20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300 touch-manipulation">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-2 h-2 bg-white rounded-sm"></div>
            <div className="w-2 h-2 bg-white rounded-sm"></div>
            <div className="w-2 h-2 bg-white rounded-sm"></div>
            <div className="w-2 h-2 bg-white rounded-sm"></div>
          </div>
          <span className="text-xs sm:text-sm font-medium">Start Here</span>
        </button>

        <button className="flex items-center space-x-2 bg-black bg-opacity-30 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white border-opacity-40 hover:bg-opacity-40 transition-all duration-300 touch-manipulation">
          <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-xs sm:text-sm font-medium">Buy Now!</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="text-center text-white z-10 px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-xs sm:text-sm font-light opacity-90">
            <span className="hover:opacity-100 transition-opacity cursor-pointer">home</span>
            <span className="text-white opacity-60">&gt;</span>
            <span className="text-white font-medium">products</span>
          </div>
        </nav>

        {/* Shop Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wider leading-none">
          SHOP
        </h1>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white opacity-30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/6 w-1.5 h-1.5 bg-white opacity-15 rounded-full animate-pulse delay-500"></div>
      </div>
    </section>
  );
};

export default ShopHeader;
