import React, { useState, useEffect, useRef } from 'react';

const ProductShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
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
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Modern Furniture Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center min-h-[300px]">
              {/* Image Section */}
              <div className="flex-1 p-6">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Modern Chair"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
              
              {/* Content Section */}
              <div className="flex-1 p-6 text-center">
                {/* First Text - Animate from top-center moving up */}
                <h3 className={`text-sm font-medium text-gray-600 mb-2 tracking-wider transform transition-all duration-800 ease-out ${
                  isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                }`}>
                  MODERN
                </h3>
                
                {/* Second Text - Animate from same point moving down */}
                <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight transform transition-all duration-800 ease-out delay-100 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  FURNITURE
                </h2>
                
                {/* Third Text - Animate from top */}
                <p className={`text-lg text-gray-600 mb-8 transform transition-all duration-800 ease-out delay-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
                }`}>
                  Start From <span className="font-semibold text-orange-500">KSh 15,000</span>
                </p>
                
                {/* Fourth Text (Button) - Animate from top */}
                <button className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-800 ease-out delay-500 text-lg hover:scale-105 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
                }`}>
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* New Lighting Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center min-h-[300px]">
              {/* Image Section */}
              <div className="flex-1 p-6">
                <img 
                  src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Modern Lamp"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
              
              {/* Content Section */}
              <div className="flex-1 p-6 text-center">
                {/* First Text - Animate from top-center moving up */}
                <h3 className={`text-sm font-medium text-gray-600 mb-2 tracking-wider transform transition-all duration-800 ease-out delay-200 ${
                  isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                }`}>
                  NEW
                </h3>
                
                {/* Second Text - Animate from same point moving down */}
                <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight transform transition-all duration-800 ease-out delay-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  LIGHTING
                </h2>
                
                {/* Third Text - Animate from top */}
                <p className={`text-lg text-gray-600 mb-8 transform transition-all duration-800 ease-out delay-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
                }`}>
                  Start From <span className="font-semibold text-orange-500">KSh 8,000</span>
                </p>
                
                {/* Fourth Text (Button) - Animate from top */}
                <button className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-800 ease-out delay-700 text-lg hover:scale-105 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
                }`}>
                  Shop Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
