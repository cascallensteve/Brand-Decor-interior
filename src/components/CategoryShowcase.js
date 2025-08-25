import React, { useState, useEffect, useRef } from 'react';

const CategoryShowcase = () => {
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
    <div ref={sectionRef} className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Bed Room Card */}
          <div className="relative rounded-3xl overflow-hidden h-96 group">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
              }}
            />
            
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
              {/* Title - Animate from top */}
              <h2 className={`text-5xl md:text-6xl font-bold mb-4 transform transition-all duration-800 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
              }`}>
                BED ROOM
              </h2>
              
              {/* Subtitle - Animate from bottom */}
              <p className={`text-lg mb-8 transform transition-all duration-800 ease-out delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                Up To 20% Off All Furniture On Store
              </p>
              
              {/* Button - Animate from top */}
              <button className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-800 ease-out delay-400 hover:scale-105 transform ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
              }`}>
                Shop Now
              </button>
            </div>
          </div>

          {/* Dining Deals Card */}
          <div className="relative rounded-3xl overflow-hidden h-96 group">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1449247613801-ab06418e1999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
              }}
            />
            
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
              {/* Title - Animate from top with delay */}
              <h2 className={`text-5xl md:text-6xl font-bold mb-4 transform transition-all duration-800 ease-out delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
              }`}>
                DINING DEALS
              </h2>
              
              {/* Subtitle - Animate from bottom with delay */}
              <p className={`text-lg mb-8 transform transition-all duration-800 ease-out delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                Up To 20% Off All Furniture On Store
              </p>
              
              {/* Button - Animate from top with delay */}
              <button className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-800 ease-out delay-600 hover:scale-105 transform ${
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

export default CategoryShowcase;
