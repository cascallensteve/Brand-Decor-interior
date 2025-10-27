import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, payForOrder, checkTransactionStatus } from '../services/api';
import { toast } from 'react-toastify';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';

const CheckoutHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
          <a href="/" className="text-white hover:text-orange-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <a href="/cart" className="text-white hover:text-orange-200 transition-colors">Cart</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Checkout</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Checkout</h1>
        <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
          Complete your order with secure M-Pesa payment
        </p>
      </div>
    </div>
  );
};

const PaymentNotification = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-100 text-green-800' : 
                  type === 'error' ? 'bg-red-100 text-red-800' : 
                  'bg-blue-100 text-blue-800';

  return (
    <div className={`${bgColor} px-6 py-4 rounded-lg mb-6 flex items-center justify-between`}>
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="ml-4">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

const MpesaPayment = ({ totalAmount, onPaymentSuccess, onPaymentError, onPaymentComplete, token }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  // Normalize phone numbers: allow inputs starting with 01, 07, or 254
  const normalizePhone = (input) => {
    if (!input) return '';
    const digits = String(input).replace(/\D+/g, '');
    if (digits.startsWith('254')) {
      return digits; // already international format
    }
    if (digits.startsWith('0')) {
      return '254' + digits.slice(1);
    }
    // If user types 7XXXXXXXX or 1XXXXXXXX (without leading 0), assume Kenya and prepend 254
    if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
      return '254' + digits;
    }
    return digits;
  };

  const isValidKenyaMobile = (normalized) => {
    // Valid when 254 followed by 9 digits and next digit set starts with 7 or 1
    return /^254(7|1)\d{8}$/.test(normalized);
  };

  const handleMpesaPayment = async () => {
    const normalized = normalizePhone(phoneNumber);
    if (!isValidKenyaMobile(normalized)) {
      onPaymentError('Please enter a valid Kenyan mobile (starts with 07, 01 or 2547/2541)');
      return;
    }

    // Use normalized 254 format
    const formattedPhone = normalized;

    console.log('Original phone:', phoneNumber);
    console.log('Formatted phone:', formattedPhone);

    setIsProcessing(true);
    setPaymentStatus('Creating order...');

    try {
      // First create the order
      const order = await onPaymentSuccess();
      
      if (!order || !order.id) {
        throw new Error('Failed to create order');
      }

      setPaymentStatus('Initiating M-Pesa payment...');

      // Now initiate payment
      const paymentResult = await payForOrder(order.id, formattedPhone, totalAmount, token);
      
      console.log('Payment result:', paymentResult);
      
      if (paymentResult.success) {
        setPaymentStatus('M-Pesa payment request sent to your phone. Please check your phone and enter your M-Pesa PIN.');
        toast.success('M-Pesa payment request sent to your phone. Please check your phone and enter your M-Pesa PIN.');
        
        // Check if we have a checkout request ID to poll
        if (paymentResult.checkout_request_id) {
          // Poll for payment status
          const pollPaymentStatus = async () => {
            try {
              const statusResult = await checkTransactionStatus(paymentResult.checkout_request_id);
              
              if (statusResult.status === 'success') {
                setPaymentStatus('Payment successful! Order confirmed.');
                toast.success('Payment successful! Your order has been confirmed.');
                onPaymentComplete();
                setIsProcessing(false);
              } else if (statusResult.status === 'failed') {
                setPaymentStatus('Payment failed. Please try again.');
                onPaymentError('Payment failed. Please try again.');
                setIsProcessing(false);
              } else {
                // Still pending, check again in 5 seconds
                setTimeout(pollPaymentStatus, 5000);
              }
            } catch (error) {
              console.error('Error checking payment status:', error);
              setPaymentStatus('Error checking payment status. Please contact support.');
              setIsProcessing(false);
            }
          };
          
          // Start polling after 10 seconds
          setTimeout(pollPaymentStatus, 10000);
        } else {
          // No checkout request ID, show manual completion message
          setPaymentStatus('Payment request sent. Please complete the payment on your phone and wait for confirmation.');
          toast.success('Payment request sent to your phone. Please complete the payment on your phone.');
          
          // Set a longer timeout to complete the payment
          setTimeout(() => {
            setPaymentStatus('Payment completed. Order confirmed.');
            toast.success('Payment completed! Your order has been confirmed.');
            onPaymentComplete();
            setIsProcessing(false);
          }, 60000); // 60 seconds timeout
        }
      } else {
        throw new Error('Payment initiation failed. Please try again.');
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      onPaymentError(`Payment failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border relative">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-3">💳</span>
        M-Pesa Payment
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          onBlur={() => setPhoneNumber(normalizePhone(phoneNumber))}
          placeholder="07XXXXXXXX, 01XXXXXXXX or 2547/2541XXXXXXXX"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          disabled={isProcessing}
        />
        <p className="text-xs text-gray-500 mt-1">Enter your M-Pesa number. Allowed: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXXX, 2541XXXXXXXXX</p>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold text-orange-600">KES {totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {paymentStatus && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">{paymentStatus}</p>
        </div>
      )}

      <button
        onClick={handleMpesaPayment}
        disabled={isProcessing || !phoneNumber}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Pay with M-Pesa'
        )}
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        You will receive an M-Pesa payment request on your phone. Enter your M-Pesa PIN to complete the transaction.
      </p>
    </div>
  );
};

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { getToken } = useAuth();
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    county: '',
    postalCode: ''
  });
  const [notification, setNotification] = useState({ message: '', type: '' });

  const shipping = 0;
  const tax = getTotalPrice() * 0;
  const finalTotal = getTotalPrice() + shipping + tax;

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentSuccess = async () => {
    try {
      const token = await getToken();
      
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          item: item.id,
          quantity: item.quantity
        })),
        shipping_info: {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: `${customerInfo.city}${customerInfo.county ? ', ' + customerInfo.county : ''}`,
          city: customerInfo.city,
          county: customerInfo.county || customerInfo.city,
          postal_code: customerInfo.postalCode || '00000'
        },
        total_price: Number(finalTotal.toFixed(2))
      };

      // Create order
      const order = await createOrder(orderData, token);
      
      return order; // Return the order for payment processing
      
    } catch (error) {
      console.error('Error creating order:', error);
      setNotification({
        message: `Order creation failed: ${error.message}`,
        type: 'error'
      });
      throw error;
    }
  };

  const handlePaymentComplete = () => {
    setNotification({
      message: `Payment successful! Your order has been confirmed. You will receive a confirmation email shortly.`,
      type: 'success'
    });
    
    // Clear cart and redirect
    setTimeout(() => {
      clearCart();
      window.location.href = '/orders';
    }, 3000);
  };

  const handlePaymentError = (error) => {
    setNotification({
      message: error,
      type: 'error'
    });
  };

  if (items.length === 0) {
    return (
      <div className="App">
        <TopNavbar />
        <MainHeader />
        <CheckoutHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to checkout.</p>
            <a
              href="/shop"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
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
      <CheckoutHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PaymentNotification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    County *
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={customerInfo.county}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={customerInfo.postalCode}
                    onChange={handleInputChange}
                    placeholder="00100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                {/* Delivery Address removed as per requirements */}
                {/* Order Notes removed as per requirements */}
              </div>
            </div>

            <MpesaPayment 
              totalAmount={finalTotal}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onPaymentComplete={handlePaymentComplete}
              token={getToken()}
            />
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-6" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium">KES {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">KES {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT (16%)</span>
                  <span className="font-medium">KES {tax.toLocaleString()}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">KES {finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-semibold text-orange-800 mb-2">M-Pesa Payment Process:</h4>
              <ol className="text-sm text-orange-700 space-y-1">
                <li>1. Enter your M-Pesa registered phone number</li>
                <li>2. Click "Pay with M-Pesa"</li>
                <li>3. Check your phone for payment request</li>
                <li>4. Enter your M-Pesa PIN to complete payment</li>
                <li>5. You'll receive a confirmation SMS</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
