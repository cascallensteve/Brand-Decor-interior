import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import DeliveryInfo from './pages/DeliveryInfo';
import Returns from './pages/Returns';
import Company from './pages/Company';
import { 
  AdminLayout, 
  Dashboard, 
  Products, 
  Users, 
  Orders, 
  Settings 
} from './admin';

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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/delivery-info" element={<DeliveryInfo />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/company" element={<Company />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              // Add authentication check here
              true ? <AdminLayout /> : <Navigate to="/login" />
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<Settings />} />
              <Route path="settings/:tab" element={<Settings />} />
            </Route>
          </Routes>
        </div>
        </Router>
      </SearchProvider>
    </CartProvider>
  );
}

export default App;
