import React, { useState, useEffect, useRef } from 'react';

const AboutUsSection = () => {
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

  const features = [
    {
      icon: "🏆",
      title: "Award-Winning Design",
      description: "Recognized globally for innovative furniture designs"
    },
    {
      icon: "🌱",
      title: "Sustainable Materials",
      description: "Eco-friendly production with responsibly sourced materials"
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep"
    },
    {
      icon: "💝",
      title: "Expert Craftsmanship",
      description: "Handcrafted with attention to every detail"
    }
  ];

  return (
    <div ref={sectionRef} className="py-20 px-6 bg-gradient-to-br from-teal-50 to-teal-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className={`transform transition-all duration-800 ease-out ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
            }`}>
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-2">
                About Brand Decor Furniture
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Creating Beautiful Spaces Since 2015
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                We believe that every home deserves beautiful, functional furniture that reflects your unique style. 
                Our carefully curated collection combines modern design with timeless craftsmanship, 
                creating pieces that transform houses into homes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-4 transform transition-all duration-800 ease-out ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`transform transition-all duration-800 ease-out delay-700 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300">
                Learn More About Us
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className={`transform transition-all duration-800 ease-out delay-200 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Beautiful modern living room"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">500+</div>
                <div className="text-gray-600 text-sm">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">10K+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">98%</div>
                <div className="text-gray-600 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
