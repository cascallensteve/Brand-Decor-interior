import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // Add newsletter signup logic here
    setEmail('');
  };

  return (
    <section className="relative bg-gradient-to-r from-teal-600 to-teal-700 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Interior Image */}
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern interior with orange chair"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white opacity-20 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-white opacity-30 rounded-full animate-pulse"></div>
          </div>

          {/* Right Side - Newsletter Content */}
          <div className="text-center lg:text-left">
            {/* Email Icon */}
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Main Text */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              GET $20 OFF YOUR<br />
              FIRST ORDER?
            </h2>
            
            <p className="text-lg text-white opacity-90 mb-8">
              Join our mailing list!
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 border-none focus:ring-2 focus:ring-white focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium transition-colors duration-300 whitespace-nowrap"
              >
                Shop Now
              </button>
            </form>

            {/* Additional Info */}
            <p className="text-sm text-white opacity-70 mt-4">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-teal-800 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
