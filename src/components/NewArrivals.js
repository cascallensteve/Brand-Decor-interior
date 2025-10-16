import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import InteractiveStarRating from './InteractiveStarRating';
import ProductRatingSection from './ProductRatingSection';

const NewArrivals = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedProductId, setAddedProductId] = useState(null);
  const sectionRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
      }
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

  const products = [
    {
      id: 1,
      name: "Aqua Globes",
      price: 1,
      priceText: "KSh 1",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4,
      reviews: 3,
      description: "This NoiseStorm font is inspired by Classic Retro and Vintage apparel, headlines, signage, logo, quote, apparel and other creative applications.",
      categories: ["Decor", "Dining Chair", "Dining Room", "Furniture", "Sofas"],
      category: "Decor"
    },
    {
      id: 2,
      name: "Modern Lounge Chair",
      price: 22500,
      priceText: "KSh 22,500",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 5,
      reviews: 12,
      description: "Elegant lounge chair perfect for modern living spaces with premium upholstery and solid wood frame.",
      categories: ["Furniture", "Living Room", "Chairs", "Modern"],
      category: "Furniture"
    },
    {
      id: 3,
      name: "Designer Chair",
      price: 18750,
      priceText: "KSh 18,750",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4,
      reviews: 8,
      description: "Stylish designer chair with ergonomic design and contemporary aesthetics for office or home use.",
      categories: ["Office", "Chairs", "Designer", "Modern"],
      category: "Dining Chair"
    },
    {
      id: 4,
      name: "Comfort Sofa",
      price: 35000,
      priceText: "KSh 35,000",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 5,
      reviews: 15,
      description: "Luxurious 3-seater sofa with premium fabric upholstery and exceptional comfort for family gatherings.",
      categories: ["Furniture", "Sofas", "Living Room", "Comfort"],
      category: "Sofas"
    },
    {
      id: 5,
      name: "Wooden Table",
      price: 28000,
      priceText: "KSh 28,000",
      image: "https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4,
      reviews: 6,
      description: "Solid wood dining table with natural finish, perfect for family meals and gatherings.",
      categories: ["Furniture", "Tables", "Dining Room", "Wood"],
      category: "Table"
    },
    {
      id: 6,
      name: "Ottoman Stool",
      price: 12500,
      priceText: "KSh 12,500",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 3,
      reviews: 4,
      description: "Versatile ottoman stool that doubles as extra seating and storage solution for any room.",
      categories: ["Furniture", "Stools", "Storage", "Versatile"],
      category: "Furniture"
    },
    {
      id: 7,
      name: "Reading Chair",
      price: 19500,
      priceText: "KSh 19,500",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4,
      reviews: 9,
      description: "Comfortable reading chair with high back support and soft cushioning for long reading sessions.",
      categories: ["Furniture", "Chairs", "Reading", "Comfort"],
      category: "Living Room"
    },
    {
      id: 8,
      name: "Bar Stool",
      price: 14000,
      priceText: "KSh 14,000",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4,
      reviews: 7,
      description: "Modern bar stool with adjustable height and sleek design perfect for kitchen islands and bars.",
      categories: ["Furniture", "Bar Stools", "Kitchen", "Adjustable"],
      category: "Dining Chair"
    }
  ];

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

  const handleAddToCart = (product, qty = 1) => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
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

  return (
    <div ref={sectionRef} className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {/* First Text - Animate from top-center moving up */}
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-wide transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
          }`}>
            NEW ARRIVALS
          </h2>
          
          {/* Second Text - Animate from same point moving down */}
          <p className={`text-lg text-gray-600 transform transition-all duration-1000 ease-out delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Sitewide Discounts & Savings Of Up To 25%
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className={`bg-gray-50 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative group transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
              }`}
              style={{
                transitionDelay: `${400 + index * 100}ms`,
                transitionDuration: '800ms'
              }}
            >
              {/* Product Image */}
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-white p-4">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
                
                {/* Quick View Icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

              {/* Star Rating */}
              <InteractiveStarRating 
                itemId={product.id} 
                currentRating={product.rating} 
                reviews={product.reviews}
                disabled={true}
              />

              {/* Product Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {product.name}
              </h3>

              {/* Price */}
              <p className="text-lg font-semibold text-orange-500 mb-4">
                {product.priceText}
              </p>

              {/* Compact Rating Section */}
              <div className="mb-4">
                <ProductRatingSection 
                  itemId={product.id} 
                  currentRating={product.rating} 
                  reviews={product.reviews}
                  compact={true}
                />
              </div>

              {/* Add to Cart Button - Show on all products */}
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300 hover:scale-105 touch-manipulation"
              >
                Add To Cart
              </button>

              {/* Inline Toast Positioned Near Button */}
              {addedProductId === product.id && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-20 bg-black text-white text-xs md:text-sm px-3 py-2 rounded-md shadow-lg pointer-events-none">
                  Added to cart
                </div>
              )}
            </div>
          ))}
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
                  <InteractiveStarRating 
                    itemId={selectedProduct.id} 
                    currentRating={selectedProduct.rating} 
                    reviews={selectedProduct.reviews} 
                    showReviews={true}
                    size="lg"
                  />

                  {/* Product Name */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedProduct.name}
                  </h2>

                  {/* Price */}
                  <p className="text-3xl font-bold text-orange-500 mb-6">
                    {selectedProduct.priceText}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Rating Section */}
                  <div className="mb-8">
                    <ProductRatingSection 
                      itemId={selectedProduct.id} 
                      currentRating={selectedProduct.rating} 
                      reviews={selectedProduct.reviews}
                    />
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4 mb-8">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 touch-manipulation"
                    >
                      <span className="text-lg">−</span>
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 touch-manipulation"
                    >
                      <span className="text-lg">+</span>
                    </button>
                    <button 
                      onClick={() => {
                        handleAddToCart(selectedProduct, quantity);
                        closeModal();
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ml-4 touch-manipulation"
                    >
                      Add To Cart
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Categories</h4>
                    <p className="text-gray-600">
                      {selectedProduct.categories.join(', ')}
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

export default NewArrivals;
