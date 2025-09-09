import React from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import ShopHeader from '../components/ShopHeader';
import ShopMain from '../components/ShopMain';
import Footer from '../components/Footer';

const Shop = () => {
  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />
      <ShopHeader />
      <ShopMain />
      <Footer />
    </div>
  );
};

export default Shop;
