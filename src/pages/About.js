import React from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import AboutUsSection from '../components/AboutUsSection';
import Footer from '../components/Footer';

const AboutHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-6">
          <a href="/" className="text-white hover:text-orange-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">About</span>
        </nav>
        <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
        <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
          Discover the story behind Brand Decor and our passion for creating beautiful living spaces
        </p>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />
      <AboutHeader />
      <AboutUsSection />
      <Footer />
    </div>
  );
};

export default About;
