import React, { useState, useEffect, useRef } from 'react';

const DealOfTheDay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
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

  useEffect(() => {
    // Set a fixed end date (e.g., end of current month)
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = endOfMonth.getTime() - currentTime;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        // Reset to next month when timer expires
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
        const newDistance = nextMonth.getTime() - currentTime;
        setTimeLeft({
          days: Math.floor(newDistance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((newDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((newDistance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((newDistance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={sectionRef} className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Deal of the Day */}
          <div className="relative rounded-3xl overflow-hidden h-96">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
              }}
            />
            
            <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white">
              {/* Title */}
              <h3 className={`text-lg text-orange-400 mb-2 transform transition-all duration-800 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}>
                Deal Of The Day
              </h3>
              
              <h2 className={`text-4xl font-bold mb-4 transform transition-all duration-800 ease-out delay-100 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                Aqua Globes 2
              </h2>
              
              {/* Price */}
              <div className={`mb-6 transform transition-all duration-800 ease-out delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}>
                <span className="line-through text-gray-300 mr-3">KSh 39,000</span>
                <span className="text-2xl font-bold text-orange-400">KSh 25,000</span>
              </div>

              {/* Countdown Timer */}
              <div className={`grid grid-cols-4 gap-4 mb-6 transform transition-all duration-800 ease-out delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs">Days</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs">Minutes</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Home Office */}
          <div className="relative rounded-3xl overflow-hidden h-96" style={{ backgroundColor: '#ff8c00' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Office Chair"
                className="w-64 h-64 object-cover rounded-full"
              />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-8">
              {/* Small Title */}
              <p className={`text-sm mb-2 transform transition-all duration-800 ease-out delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}>
                New Arrivals
              </p>
              
              {/* Main Title */}
              <h2 className={`text-5xl md:text-6xl font-bold mb-8 transform transition-all duration-800 ease-out delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                HOME<br />OFFICE
              </h2>
              
              {/* Button */}
              <button className={`bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-800 ease-out delay-500 hover:scale-105 transform ${
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

export default DealOfTheDay;
