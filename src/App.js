import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import TopNavbar from './components/TopNavbar';
import MainHeader from './components/MainHeader';
import HeroSection from './components/HeroSection';
import ProductShowcase from './components/ProductShowcase';
import NewArrivals from './components/NewArrivals';
import CategoryShowcase from './components/CategoryShowcase';
import TrendingItems from './components/TrendingItems';
import DealOfTheDay from './components/DealOfTheDay';
import FinalShowcase from './components/FinalShowcase';
import TestimonialSection from './components/TestimonialSection';
import AboutUsSection from './components/AboutUsSection';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Charity from './pages/Charity';
import Login from './pages/Login';

function App() {
  return (
    <CartProvider>
      <SearchProvider>
        <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={
              <>
                <TopNavbar />
                <MainHeader />
                <HeroSection />
                <ProductShowcase />
                <NewArrivals />
                <CategoryShowcase />
                <TrendingItems />
                <DealOfTheDay />
                <FinalShowcase />
                <TestimonialSection />
                <AboutUsSection />
                <Footer />
              </>
            } />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/charity" element={<Charity />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        </Router>
      </SearchProvider>
    </CartProvider>
  );
}

export default App;
