import React, { useState, useEffect, useRef } from 'react';

const TrendingItems = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);

  const products = [
    {
      id: 1,
      name: "Aqua Globes",
      price: "KSh 16,250",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 5
    },
    {
      id: 2,
      name: "Aqua Globes",
      price: "KSh 16,250",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 5
    },
    {
      id: 3,
      name: "Aqua Globes",
      price: "KSh 16,250",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 5
    },
    {
      id: 4,
      name: "Aqua Globes",
      price: "KSh 16,250",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 5
    },
    {
      id: 5,
      name: "Aqua Globes",
      price: "KSh 16,250",
      image: "https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 5
    },
    {
      id: 6,
      name: "Aqua Globes",
      price: "KSh 16,250",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 5
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 4) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 4 + products.length) % products.length);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-orange-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div ref={sectionRef} className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transform transition-all duration-800 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
            }`}>
              TRENDING ITEMS
            </h2>
            <p className={`text-lg text-gray-600 transform transition-all duration-800 ease-out delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              Sitewide Discounts & Savings Of Up To 25%
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex space-x-4">
            <button
              onClick={prevSlide}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(currentIndex, currentIndex + 4).map((product, index) => (
            <div 
              key={product.id}
              className={`bg-white rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
              }`}
              style={{
                transitionDelay: `${400 + index * 100}ms`,
                transitionDuration: '800ms'
              }}
            >
              {/* Product Image */}
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-50 p-4">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>

              {/* Star Rating */}
              <StarRating rating={product.rating} />

              {/* Product Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {product.name}
              </h3>

              {/* Price */}
              <p className="text-lg font-semibold text-orange-500">
                {product.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingItems;
