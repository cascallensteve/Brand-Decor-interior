// src/components/ProductShowcase.jsx
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext"; // ✅ use global cart

const ProductShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedToast, setAddedToast] = useState(false); // ✅ inline toast flag

  const { addToCart } = useCart(); // ✅ from context

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleShopNow = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    addToCart(product); // ✅ add via CartContext
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const products = [
    {
      id: 1,
      title: "FURNITURE",
      subtitle: "MODERN",
      price: 15000,
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "LIGHTING",
      subtitle: "NEW",
      price: 8000,
      img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div ref={sectionRef} className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* inline toast only in details view; global message removed */}

        {!selectedProduct ? (
          // 🔹 Product List View
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center min-h-[300px]">
                  {/* Image Section */}
                  <div className="flex-1 p-6">
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 text-center">
                    <h3
                      className={`text-sm font-medium text-gray-600 mb-2 tracking-wider transform transition-all duration-800 ease-out ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-8 opacity-0"
                      }`}
                    >
                      {product.subtitle}
                    </h3>
                    <h2
                      className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight transform transition-all duration-800 ease-out delay-100 ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      {product.title}
                    </h2>
                    <p
                      className={`text-lg text-gray-600 mb-8 transform transition-all duration-800 ease-out delay-300 ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-12 opacity-0"
                      }`}
                    >
                      Start From{" "}
                      <span className="font-semibold text-orange-500">
                        KSh {product.price.toLocaleString()}
                      </span>
                    </p>
                    <button
                      onClick={() => handleShopNow(product)}
                      className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-800 ease-out delay-500 text-lg hover:scale-105 transform ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-12 opacity-0"
                      }`}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 🔹 Product Details View
          <div className="relative bg-white p-8 rounded-3xl shadow-lg text-center">
            <img
              src={selectedProduct.img}
              alt={selectedProduct.title}
              className="w-full h-96 object-cover rounded-2xl mb-6"
            />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {selectedProduct.title}
            </h2>
            <h3 className="text-lg text-gray-600 mb-2">
              {selectedProduct.subtitle}
            </h3>
            <p className="text-xl text-orange-500 font-semibold mb-6">
              KSh {selectedProduct.price.toLocaleString()}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAddToCart(selectedProduct)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:scale-105 transform transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBack}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full font-semibold text-lg"
              >
                Back
              </button>
            </div>

            {/* Inline Toast Positioned Near Buttons */}
            {addedToast && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-8 bg-black text-white text-xs md:text-sm px-3 py-2 rounded-md shadow-lg pointer-events-none">
                Added to cart
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductShowcase;
