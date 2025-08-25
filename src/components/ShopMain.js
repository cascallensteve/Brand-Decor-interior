import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ShopMain = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [sortBy, setSortBy] = useState('Default');
  const [priceRange, setPriceRange] = useState([7500, 35000]);
  const [cartMessage, setCartMessage] = useState('');
  const { addToCart, getTotalItems } = useCart();
  const handleAddToCart = (product) => {
    addToCart(product);
    setCartMessage(`${product.name} added to cart!`);
    setTimeout(() => setCartMessage(''), 3000);
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
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: true,
      category: 'Sofas'
    },
    {
      id: 2,
      name: 'Modern Dining Chair',
      price: 8500.00,
      originalPrice: null,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Dining Chair'
    },
    {
      id: 3,
      name: 'Scandinavian Coffee Table',
      price: 12500.00,
      originalPrice: null,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Table'
    },
    {
      id: 4,
      name: 'Luxury Armchair',
      price: 18750.00,
      originalPrice: 22500.00,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: true,
      category: 'Living Room'
    },
    {
      id: 5,
      name: 'Modern Floor Lamp',
      price: 7500.00,
      originalPrice: null,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Wall Lamp'
    },
    {
      id: 6,
      name: 'Velvet Ottoman',
      price: 9500.00,
      originalPrice: null,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1565689386310-8b26ef71b11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Furniture'
    },
    {
      id: 7,
      name: '3-Seater Yellow Sofa',
      price: 25000.00,
      originalPrice: 30000.00,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: true,
      category: 'Sofas'
    },
    {
      id: 8,
      name: 'Executive Office Chair',
      price: 15000.00,
      originalPrice: null,
      rating: 4,
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Dining Chair'
    },
    {
      id: 9,
      name: 'Wooden Dining Table',
      price: 32500.00,
      originalPrice: null,
      rating: 5,
      image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      sale: false,
      category: 'Dining Room'
    }
  ];

  const filteredProducts = selectedCategory === 'All Category' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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
              {filteredProducts.map((product) => (
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
                  </div>

                  <div className="p-6 text-center">
                    {/* Rating */}
                    <div className="flex items-center justify-center mb-3">
                      {[...Array(product.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-orange-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>

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
            <div className="flex justify-center items-center gap-2">
              <button className="w-10 h-10 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                1
              </button>
              <button className="w-10 h-10 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors border">
                2
              </button>
              <button className="text-gray-700 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="px-4 py-2 text-gray-700 font-medium hover:text-orange-500 transition-colors">
                Last
              </button>
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
      </div>
    </div>
  );
};

export default ShopMain;
