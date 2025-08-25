import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ShopMain = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [sortBy, setSortBy] = useState('Default');
  const [priceRange, setPriceRange] = useState([7500, 35000]);
  const [cartMessage, setCartMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart, getTotalItems } = useCart();
  const handleAddToCart = (product, qty = 1) => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    setCartMessage(`${product.name} added to cart!`);
    setTimeout(() => setCartMessage(''), 3000);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    setQuantity(1);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const StarRating = ({ rating, reviews, showReviews = false }) => {
    return (
      <div className="flex items-center space-x-1 mb-3">
        <div className="flex space-x-1">
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
        {showReviews && (
          <span className="text-gray-500 text-sm ml-2">({reviews} customer reviews)</span>
        )}
      </div>
    );
  };

  const categories = [
    { name: 'All Category', count: 10 },
    { name: 'Bathroom', count: 1 },
    { name: 'Bedroom', count: 1 },
    { name: 'Decor', count: 3 },
    { name: 'Dining Chair', count: 6 },
    { name: 'Dining Room', count: 3 },
    { name: 'Furniture', count: 9 },
    { name: 'Living Room', count: 3 },
    { name: 'Sofas', count: 8 },
    { name: 'Table', count: 2 },
    { name: 'Wall Lamp', count: 1 }
  ];

  const brands = [
    { name: 'Decor', count: 5 },
    { name: 'Dining Chair', count: 4 },
    { name: 'Dining Room', count: 4 }
  ];

  const colors = [
    '#000000', '#00FFFF', '#8B4513', '#0000FF', '#00FF00', '#808080', '#008000',
    '#00BFFF', '#90EE90', '#FF4500', '#800080', '#FFA500', '#FF1493', '#4B0082',
    '#FF0000', '#FFFF00'
  ];

  const products = [
    {
      id: 1,
      name: 'AmazonBasics 2-Seater Sofa',
      price: 16250.00,
      originalPrice: null,
      rating: 5,
      reviews: 12,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: true,
      category: 'Sofas',
      description: 'Comfortable 2-seater sofa perfect for small living spaces. Premium fabric upholstery with durable frame construction.',
      categories: ['Sofas', 'Living Room', 'Furniture', 'Comfort']
    },
    {
      id: 2,
      name: 'Modern Dining Chair',
      price: 8500.00,
      originalPrice: null,
      rating: 5,
      reviews: 8,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Dining Chair',
      description: 'Stylish modern dining chair with ergonomic design and contemporary aesthetics. Perfect for dining rooms and kitchens.',
      categories: ['Dining Chair', 'Furniture', 'Modern', 'Ergonomic']
    },
    {
      id: 3,
      name: 'Scandinavian Coffee Table',
      price: 12500.00,
      originalPrice: null,
      rating: 5,
      reviews: 15,
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Table',
      description: 'Minimalist Scandinavian coffee table with clean lines and natural wood finish. Perfect centerpiece for modern living rooms.',
      categories: ['Table', 'Living Room', 'Scandinavian', 'Wood']
    },
    {
      id: 4,
      name: 'Luxury Armchair',
      price: 18750.00,
      originalPrice: 22500.00,
      rating: 4,
      reviews: 6,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: true,
      category: 'Living Room',
      description: 'Luxurious armchair with premium leather upholstery and solid hardwood frame. Exceptional comfort and style.',
      categories: ['Living Room', 'Armchair', 'Luxury', 'Leather']
    },
    {
      id: 5,
      name: 'Modern Floor Lamp',
      price: 7500.00,
      originalPrice: null,
      rating: 4,
      reviews: 4,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Wall Lamp',
      description: 'Contemporary floor lamp with adjustable height and LED lighting. Perfect ambient lighting for any room.',
      categories: ['Wall Lamp', 'Lighting', 'Modern', 'LED']
    },
    {
      id: 6,
      name: 'Velvet Ottoman',
      price: 9500.00,
      originalPrice: null,
      rating: 5,
      reviews: 9,
      image: 'https://images.unsplash.com/photo-1565689386310-8b26ef71b11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Furniture',
      description: 'Luxurious velvet ottoman with hidden storage compartment. Versatile piece for extra seating or storage.',
      categories: ['Furniture', 'Ottoman', 'Storage', 'Velvet']
    },
    {
      id: 7,
      name: '3-Seater Yellow Sofa',
      price: 25000.00,
      originalPrice: 30000.00,
      rating: 5,
      reviews: 18,
      image: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: true,
      category: 'Sofas',
      description: 'Vibrant yellow 3-seater sofa that makes a bold statement. Comfortable seating for the whole family.',
      categories: ['Sofas', 'Living Room', 'Bold', 'Family']
    },
    {
      id: 8,
      name: 'Executive Office Chair',
      price: 15000.00,
      originalPrice: null,
      rating: 4,
      reviews: 11,
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Dining Chair',
      description: 'Professional executive office chair with ergonomic support and premium materials. Perfect for long work sessions.',
      categories: ['Dining Chair', 'Office', 'Executive', 'Ergonomic']
    },
    {
      id: 9,
      name: 'Wooden Dining Table',
      price: 32500.00,
      originalPrice: null,
      rating: 5,
      reviews: 7,
      image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Dining Room',
      description: 'Solid wood dining table with natural grain finish. Seats 6-8 people comfortably for family gatherings.',
      categories: ['Dining Room', 'Table', 'Wood', 'Family']
    }
  ];

  const filteredProducts = selectedCategory === 'All Category' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Filter Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Filter
            </button>
            <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              Sale
            </span>
          </div>
          
          {/* Cart Info */}
          <div className="flex items-center gap-4">
            {cartMessage && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                {cartMessage}
              </div>
            )}
            <div className="bg-black text-white px-4 py-2 rounded-lg font-medium">
              Cart ({getTotalItems()})
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Category Filter */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Category</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category.name} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.name}
                        onChange={() => setSelectedCategory(category.name)}
                        className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Brand</h3>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand.name} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{brand.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">({brand.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colors Filter */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Colors</h3>
              <div className="grid grid-cols-7 gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="7500"
                  max="35000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>KES {priceRange[0].toLocaleString()}</span>
                  <span>KES {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Filter
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header with Sort */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Product</h2>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black text-white px-6 py-3 rounded-lg font-medium appearance-none cursor-pointer pr-10"
                >
                  <option value="Default">Sort By: Default</option>
                  <option value="Price Low to High">Price: Low to High</option>
                  <option value="Price High to Low">Price: High to Low</option>
                  <option value="Newest">Newest First</option>
                  <option value="Rating">Highest Rated</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.sale && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Sale
                      </span>
                    )}
                    
                    {/* Quick View Icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => openModal(product)}
                        className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    {/* Rating */}
                    <StarRating rating={product.rating} reviews={product.reviews} />

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">{product.name}</h3>

                    {/* Price */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">KES {product.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="text-xl font-bold text-gray-900">KES {product.price.toLocaleString()}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors touch-manipulation"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button 
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNumber 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-white text-gray-700 border hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-16 py-12 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Award-Winning Design */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Award-Winning Design</h3>
              <p className="text-gray-600 text-sm">Recognized globally for innovative furniture designs</p>
            </div>

            {/* Sustainable Materials */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z"/>
                  <path d="M7 13l3 3 7-7"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Sustainable Materials</h3>
              <p className="text-gray-600 text-sm">Eco-friendly production with responsibly sourced materials</p>
            </div>

            {/* Fast Delivery */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick and reliable shipping to your doorstep</p>
            </div>

            {/* Expert Craftsmanship */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Expert Craftsmanship</h3>
              <p className="text-gray-600 text-sm">Handcrafted with attention to every detail</p>
            </div>

          </div>
        </div>

        {/* Promotional Email Signup Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-6">
              <svg className="w-16 h-16 text-white mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              GET $20 OFF YOUR
            </h2>
            <h2 className="text-4xl font-bold text-white mb-6">
              FIRST ORDER?
            </h2>
            <p className="text-white text-xl mb-8">Join our mailing list!</p>
            
            <div className="flex justify-center max-w-md mx-auto">
              <div className="flex w-full">
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="flex-1 px-6 py-4 rounded-l-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-r-lg font-medium transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative furniture image */}
          <div className="absolute left-8 bottom-0 opacity-20">
            <div className="w-32 h-32 bg-orange-300 rounded-t-full"></div>
          </div>
        </div>

        {/* Product Modal */}
        {modalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col md:flex-row">
                {/* Product Image */}
                <div className="md:w-1/2 p-8 bg-gray-50 rounded-l-3xl">
                  <img 
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 p-8 relative">
                  {/* Close Button */}
                  <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Rating with Reviews */}
                  <StarRating rating={selectedProduct.rating} reviews={selectedProduct.reviews} showReviews={true} />

                  {/* Product Name */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedProduct.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-6">
                    {selectedProduct.originalPrice && (
                      <span className="text-gray-400 line-through text-lg">KES {selectedProduct.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-3xl font-bold text-orange-500">KES {selectedProduct.price.toLocaleString()}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4 mb-8">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <span className="text-lg">−</span>
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <span className="text-lg">+</span>
                    </button>
                    <button 
                      onClick={() => {
                        handleAddToCart(selectedProduct, quantity);
                        closeModal();
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ml-4"
                    >
                      Add To Cart
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Categories</h4>
                    <p className="text-gray-600">
                      {selectedProduct.categories?.join(', ')}
                    </p>
                  </div>

                  {/* More Information */}
                  <div className="flex items-center justify-between">
                    <button className="text-gray-600 hover:text-gray-900">More Information</button>
                    <div className="flex space-x-3">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopMain;
