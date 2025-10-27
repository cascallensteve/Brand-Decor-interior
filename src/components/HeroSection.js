import React, { useState } from 'react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://res.cloudinary.com/dqvsjtkqw/image/upload/v1755720591/hero_image1_lxoxru.webp',
      title: 'SPRING',
      subtitle: 'COLLECTION',
      price: 'KSh 20,000',
      buttonText: 'Shop Now'
    },
    {
      image: 'https://res.cloudinary.com/dqvsjtkqw/image/upload/v1755720944/elegant-hotel-room-with-big-bed_edutzo.webp',
      title: 'ELEGANT',
      subtitle: 'BEDROOM',
      price: 'KSh 30,000',
      buttonText: 'Explore Collection'
    },
    {
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'MODERN',
      subtitle: 'LIVING ROOM',
      price: 'KSh 40,000',
      buttonText: 'Shop Collection'
    },
    {
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'LUXURY',
      subtitle: 'DINING',
      price: 'KSh 50,000',
      buttonText: 'View More'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative m-3 sm:m-6">
      {/* Carousel Container */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${slide.image}')`
              }}
            />
            
            {/* Decorative angled edge */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-white transform rotate-45 opacity-15 rounded-lg"></div>
            
            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white px-4 sm:px-6 max-w-2xl">
                {/* Title - Animate from top */}
                <h2 className={`text-sm sm:text-lg font-medium mb-2 sm:mb-4 tracking-wider transform transition-all duration-1000 ease-out ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
                }`}>
                  {slide.title}
                </h2>
                
                {/* Subtitle - Animate from bottom */}
                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-wide leading-tight transform transition-all duration-1000 ease-out delay-200 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}>
                  {slide.subtitle}
                </h1>
                
                {/* Price - Split animation from left and right */}
                <div className={`text-lg sm:text-xl mb-6 sm:mb-8 font-light transform transition-all duration-1000 ease-out delay-400 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}>
                  <span className={`inline-block transform transition-all duration-800 ease-out delay-500 ${
                    index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                  }`}>
                    Start From
                  </span>
                  {' '}
                  <span className={`inline-block font-semibold transform transition-all duration-800 ease-out delay-600 ${
                    index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                  }`}>
                    {slide.price}
                  </span>
                </div>
                
                {/* Button - Animate from bottom */}
                <button className={`bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-md font-semibold transition-all duration-1000 ease-out delay-700 text-base sm:text-lg transform touch-manipulation ${
                  index === currentSlide ? 'translate-y-0 opacity-100 hover:scale-105' : 'translate-y-20 opacity-0'
                }`}>
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors z-20 touch-manipulation"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors z-20 touch-manipulation"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-orange-500' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
