import React from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import ShopHeader from '../components/ShopHeader';
import ShopMain from '../components/ShopMain';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const Shop = () => {
  // const { darkMode } = useTheme(); // Available for future use
  
  return (
    <div className="App bg-white dark:bg-gray-900 transition-colors">
      <TopNavbar />
      <MainHeader />
      <ShopHeader />
      <ShopMain />
      <Footer />
    </div>
  );
};

export default Shop;
