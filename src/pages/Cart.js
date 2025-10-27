import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';

const CartHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
          <a href="/" className="text-white hover:text-orange-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Cart</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Shopping Cart</h1>
        <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
          Review your selected items and proceed to checkout
        </p>
      </div>
    </div>
  );
};

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
      <div className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-2">Category: {item.category}</p>
        <p className="text-xl font-bold text-orange-600">KES {item.price.toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-2 hover:bg-gray-100 transition-colors touch-manipulation"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-2 font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition-colors touch-manipulation"
          >
            +
          </button>
        </div>
        
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const CartSummary = ({ items, totalPrice }) => {
  const shipping = 0;
  const tax = totalPrice * 0; // 16% VAT in Kenya

  // no vat at the momemts 
  const finalTotal = totalPrice + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-medium">KES {totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">KES {shipping.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">VAT (0%)</span>
          <span className="font-medium">KES {tax.toLocaleString()}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-orange-600">KES {finalTotal.toLocaleString()}</span>
        </div>
      </div>

      <Link 
        to="/checkout"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors mb-3 touch-manipulation block text-center"
      >
        Proceed to Checkout
      </Link>
      
      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors touch-manipulation">
        Continue Shopping
      </button>
    </div>
  );
};

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="App">
        <TopNavbar />
        <MainHeader />
        <CartHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Browse our collection to find amazing furniture.
            </p>
            <a
              href="/shop"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg font-medium transition-colors"
            >
              Start Shopping
            </a>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />
      <CartHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Cart Items ({items.length})
              </h2>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <CartSummary items={items} totalPrice={getTotalPrice()} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
