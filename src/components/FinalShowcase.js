import React, { useState, useEffect, useRef } from 'react';

const FinalShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Sofa Style 2020 */}
          <div className="relative rounded-3xl overflow-hidden h-96" style={{ backgroundColor: '#4a5568' }}>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
              }}
            />
            
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
              <p className={`text-sm mb-2 transform transition-all duration-800 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}>
                New Arrivals
              </p>
              
              <h2 className={`text-4xl font-bold mb-6 transform transition-all duration-800 ease-out delay-100 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                SOFA STYLE<br />2020
              </h2>
              
              <button className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-800 ease-out delay-200 hover:scale-105 transform ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
              }`}>
                Shop Now
              </button>
            </div>
          </div>

          {/* Perfect Fit For Your Home */}
          <div className="relative rounded-3xl overflow-hidden h-96 bg-gray-200">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
              }}
            />
            
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-black p-8">
              <p className={`text-sm mb-2 text-gray-600 transform transition-all duration-800 ease-out delay-100 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}>
                New Arrivals
              </p>
              
              <h2 className={`text-3xl font-bold mb-6 transform transition-all duration-800 ease-out delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                PERFECT FIT FOR<br />YOUR HOME
              </h2>
              
              <button className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-800 ease-out delay-300 hover:scale-105 transform ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
              }`}>
                Shop Now
              </button>
            </div>
          </div>

          {/* Sale Up To 30% Off */}
          <div className="relative rounded-3xl overflow-hidden h-96" style={{ backgroundColor: '#2d5a5a' }}>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
              }}
            />
            
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
              <p className={`text-sm mb-2 transform transition-all duration-800 ease-out delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}>
                New Arrivals
              </p>
              
              <h2 className={`text-3xl font-bold mb-6 transform transition-all duration-800 ease-out delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                SALE UP TO 30%<br />OFF
              </h2>
              
              <button className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-800 ease-out delay-400 hover:scale-105 transform ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
              }`}>
                Shop Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinalShowcase;
