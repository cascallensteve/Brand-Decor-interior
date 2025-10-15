import React, { useState, useEffect, useRef } from 'react';

const Newsletter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div ref={sectionRef} className="py-16 px-6" style={{ backgroundColor: '#7db0a8' }}>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#7db0a8' }}>
          <div className="flex flex-col lg:flex-row items-center min-h-[400px]">
            
            {/* Left side - Chair Image */}
            <div className="lg:w-1/2 p-8 flex justify-center">
              <div className="relative">
                {/* Chair Image */}
                <img 
                  src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Orange Chair"
                  className={`w-80 h-80 object-cover rounded-2xl transform transition-all duration-1000 ease-out ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
                />
                
                {/* Side Table with Plant */}
                <div className={`absolute -right-16 top-32 transform transition-all duration-1000 ease-out delay-200 ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                }`}>
                  <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:w-1/2 p-8 text-white">
              {/* Email Icon */}
              <div className={`mb-6 transform transition-all duration-800 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}>
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Main Title - Split animation */}
              <h2 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight transform transition-all duration-800 ease-out delay-100 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                GET KSh 2,500 OFF YOUR<br />
                <span className={`transform transition-all duration-800 ease-out delay-200 ${
                  isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                }`}>
                  FIRST ORDER?
                </span>
              </h2>
              
              {/* Subtitle */}
              <p className={`text-xl mb-8 transform transition-all duration-800 ease-out delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                Join our mailing list!
              </p>
              
              {/* Email Form */}
              <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-800 ease-out delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Shop Now
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
