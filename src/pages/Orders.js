import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getOrderDetails, getMyOrders, payForOrder, checkTransactionStatus, getItemDetails, getAuthHeader } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';
import { 
  FaShoppingBag, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTruck,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaSpinner
} from 'react-icons/fa';

// Lightweight image component with fallback and fade-in to stop flickering
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const placeholder = '/placeholder-image.jpg';

  useEffect(() => {
    setImgSrc(src);
    setLoaded(false);
  }, [src]);

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          if (imgSrc !== placeholder) {
            // prevent infinite loop by setting once
            setImgSrc(placeholder);
          }
        }}
        className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
};

// Resolve relative image URLs from API to absolute
const API_BASE = 'https://brand-decor-ecom-api.vercel.app';
const resolveImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '/placeholder-image.jpg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState({});
  const [enrichingProducts, setEnrichingProducts] = useState(false);
  const [payDialog, setPayDialog] = useState({ open: false, orderId: null, amount: 0, phone: '', error: '' });
  const { user, getToken } = useAuth();
  // const { darkMode } = useTheme(); // Available for future use

  // order issue and image issues 
  const enrichOrderWithProductDetails = async (orders) => {
  setEnrichingProducts(true);
  try {
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            if (item.item && typeof item.item === "number") {
              try {
                const token = getToken();
                const productDetails = await getItemDetails(item.item, token);

                // Normalize for multiple API response formats
                const normalizedProduct = {
                  id: productDetails.id,
                  name: productDetails.name || productDetails.title || productDetails.product_name || "Unknown Product",
                  price: parseFloat(
                    productDetails.regular_price || 
                    productDetails.price || 
                    productDetails.amount || 
                    productDetails.cost || 
                    productDetails.unit_price ||
                    0
                  ),
                  image: resolveImageUrl(
                    productDetails.photo ||
                    productDetails.image ||
                    productDetails.image_url ||
                    productDetails.thumbnail ||
                    (productDetails.images && productDetails.images[0]?.src) ||
                    (productDetails.images && productDetails.images[0]?.url) ||
                    (productDetails.images && productDetails.images[0]) ||
                    "/placeholder-image.jpg"
                  ),
                };

                console.log(' Product details for item', item.item, ':', productDetails);
                console.log(' Normalized product:', normalizedProduct);

                return {
                  ...item,
                  item: normalizedProduct,
                };
              } catch (error) {
                console.error(`Error fetching product details for item ${item.item}:`, error);
                // Try to get price from the original item data if available
                const fallbackPrice = parseFloat(
                  item.price || 
                  item.unit_price || 
                  item.amount || 
                  0
                );
                
                return {
                  ...item,
                  item: {
                    id: item.item,
                    name: item.name || `Item ${item.item}`,
                    price: fallbackPrice,
                    image: resolveImageUrl(item.image || item.photo || "/placeholder-image.jpg"),
                  },
                };
              }
            }
            return item;
          })
        );

        return {
          ...order,
          items: enrichedItems,
        };
      })
    );

    return enrichedOrders;
  } finally {
    setEnrichingProducts(false);
  }
};


  // end of orders issues here

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const ordersData = await getMyOrders(token);
      const enrichedOrders = await enrichOrderWithProductDetails(ordersData);
      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(`Failed to load orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'paid':
        return <FaCheckCircle className="text-blue-500" />;
      case 'processing':
        return <FaTruck className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'refunded':
        return <FaTimesCircle className="text-orange-500" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      case 'on_hold':
        return <FaClock className="text-yellow-500" />;
      case 'returned':
        return <FaTimesCircle className="text-gray-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'returned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Phone helpers (Kenya): accept 07/01/254 and normalize to 254XXXXXXXXX
  const normalizePhone = (input) => {
    if (!input) return '';
    const digits = String(input).replace(/\D+/g, '');
    if (digits.startsWith('254')) return digits;
    if (digits.startsWith('0')) return '254' + digits.slice(1);
    if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) return '254' + digits;
    return digits;
  };
  const isValidKenyaMobile = (normalized) => /^254(7|1)\d{8}$/.test(normalized);

  const handleViewOrder = async (orderId) => {
    try {
      setLoading(true);
      const token = getToken();
      const orderDetails = await getOrderDetails(orderId, token);
      setSelectedOrder(orderDetails);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error(`Failed to load order details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId, amount, overridePhone) => {
    try {
      setPaymentLoading(prev => ({ ...prev, [orderId]: true }));
      const token = getToken();
      
      // Get user's phone number from the order or user profile
      const phoneNumber = overridePhone || user?.phone_no || '';
      const normalizedPhone = normalizePhone(phoneNumber);
      if (!isValidKenyaMobile(normalizedPhone)) {
        toast.error('Please enter a valid Kenyan mobile (07/01/254).');
        setPaymentLoading(prev => ({ ...prev, [orderId]: false }));
        return;
      }
      
      const paymentResult = await payForOrder(orderId, normalizedPhone, amount, token);
      
      toast.success('Payment request sent to your phone. Please check your M-Pesa and enter your PIN.');
      
      // Check if we have a checkout request ID to poll
      if (paymentResult.checkout_request_id) {
        // Poll for payment status
        const pollPaymentStatus = async () => {
          try {
            const statusResult = await checkTransactionStatus(paymentResult.checkout_request_id);
            
            if (statusResult.status === 'success') {
              toast.success('Payment successful! Your order status will be updated shortly.');
              fetchOrders(); // Refresh orders
              setPaymentLoading(prev => ({ ...prev, [orderId]: false }));
            } else if (statusResult.status === 'failed') {
              toast.error('Payment failed. Please try again.');
              setPaymentLoading(prev => ({ ...prev, [orderId]: false }));
            } else {
              // Still pending, check again in 5 seconds
              setTimeout(pollPaymentStatus, 5000);
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
            setPaymentLoading(prev => ({ ...prev, [orderId]: false }));
          }
        };
        
        // Start polling after 10 seconds
        setTimeout(pollPaymentStatus, 10000);
      } else {
        // No checkout request ID, assume payment was successful
        toast.success('Payment request sent to your phone. Please complete the payment on your phone.');
        
        // Set a timeout to refresh orders after 30 seconds
        setTimeout(() => {
          toast.success('Payment completed! Your order status will be updated shortly.');
          fetchOrders(); // Refresh orders
          setPaymentLoading(prev => ({ ...prev, [orderId]: false }));
        }, 30000);
      }
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(`Payment failed: ${error.message}`);
      setPaymentLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const calculateTotal = (order) => {
    // First check if order has a total amount from API
    if (order.total_price && parseFloat(order.total_price) > 0) {
      return parseFloat(order.total_price);
    }
    
    if (order.total_amount && parseFloat(order.total_amount) > 0) {
      return parseFloat(order.total_amount);
    }
    
    if (order.total && parseFloat(order.total) > 0) {
      return parseFloat(order.total);
    }
    
    if (order.amount && parseFloat(order.amount) > 0) {
      return parseFloat(order.amount);
    }
    
    // Calculate total from items
    const itemsTotal = order.items.reduce((total, item) => {
      const itemPrice = item.item?.price || item.price || item.unit_price || 0;
      const quantity = item.quantity || 1;
      return total + (parseFloat(itemPrice) * quantity);
    }, 0);
    
    // Add shipping and tax if needed
    const shipping = parseFloat(order.shipping_cost || order.shipping || 0);
    const tax = parseFloat(order.tax_amount || order.tax || 0);
    const finalTotal = itemsTotal + shipping + tax;
    
    console.log('🧮 Order total calculation:', {
      orderId: order.id,
      itemsTotal,
      shipping,
      tax,
      finalTotal,
      orderData: order
    });
    
    return finalTotal > 0 ? finalTotal : 0;
  };

  if (loading || enrichingProducts) {
    return (
      <div className="App">
        <TopNavbar />
        <MainHeader />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {loading ? 'Loading your orders...' : 'Loading product details...'}
            </p>
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FaShoppingBag className="text-3xl text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">You haven't placed any orders yet.</p>
            <a
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const total = calculateTotal(order);
              const isPaymentLoading = paymentLoading[order.id];
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          KES {total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span>Ordered on {formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaUser className="mr-2 text-gray-400" />
                        <span>{order.shipping?.first_name} {order.shipping?.last_name}</span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <ImageWithFallback
                              src={resolveImageUrl(
                                item.item?.photo ||
                                item.item?.image ||
                                item.item?.image_url ||
                                item.item?.thumbnail ||
                                (item.item?.images && item.item.images[0]?.src) ||
                                (item.item?.images && item.item.images[0]?.url) ||
                                (item.item?.images && item.item.images[0]) ||
                                item.photo ||
                                item.image ||
                                '/placeholder-image.jpg'
                              )}
                              alt={item.item?.name || item.name || 'Product'}
                              className="w-12 h-12 rounded-lg"
                            />
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">
                                {item.item?.name || `Item ${item.item}`}
                              </span>
                              <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-medium text-orange-600">
                              KES {item.item?.price ? (item.item.price * item.quantity).toLocaleString() : 'N/A'}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <FaEye className="mr-2" />
                          View Details
                        </button>
                        
                        {(order.status === 'pending' || order.status === 'failed') && (
                          <button
                            onClick={() => setPayDialog({ open: true, orderId: order.id, amount: total, phone: user?.phone_no || '', error: '' })}
                            disabled={isPaymentLoading}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                          >
                            {isPaymentLoading ? (
                              <>
                                <FaSpinner className="mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FaCreditCard className="mr-2" />
                                Pay Now
                              </>
                            )}
                          </button>
                        )}
                        
                        {order.status === 'pending' && (
                          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.id} Details
                  </h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaTimesCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <ImageWithFallback
                            src={resolveImageUrl(
                              item.item?.photo ||
                              item.item?.image ||
                              item.item?.image_url ||
                              item.item?.thumbnail ||
                              (item.item?.images && item.item.images[0]?.src) ||
                              (item.item?.images && item.item.images[0]?.url) ||
                              (item.item?.images && item.item.images[0]) ||
                              item.photo ||
                              item.image ||
                              '/placeholder-image.jpg'
                            )}
                            alt={item.item?.name || item.name || 'Product'}
                            className="w-16 h-16 rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.item?.name || item.item?.title || item.item?.product_name || 'Unknown Item'}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Unit Price: KES {item.item?.price?.toLocaleString() || 'N/A'}</p>
                            <p className="text-lg font-semibold text-orange-500">
                              Total: KES {item.item?.price ? (item.item.price * item.quantity).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <FaUser className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {selectedOrder.shipping?.first_name} {selectedOrder.shipping?.last_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedOrder.shipping?.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaPhone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{selectedOrder.shipping?.phone}</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-900">{selectedOrder.shipping?.address}</p>
                          <p className="text-gray-600">
                            {selectedOrder.shipping?.city}, {selectedOrder.shipping?.county}
                          </p>
                          <p className="text-gray-600">{selectedOrder.shipping?.postal_code}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-orange-500">
                          KES {calculateTotal(selectedOrder).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      {/* Pay Now Phone Prompt */}
      {payDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Enter M-Pesa Phone</h4>
            <p className="text-sm text-gray-600 mb-4">We will send a payment request to this number.</p>
            <input
              type="tel"
              value={payDialog.phone}
              onChange={(e) => setPayDialog({ ...payDialog, phone: e.target.value, error: '' })}
              onBlur={() => setPayDialog((d) => ({ ...d, phone: normalizePhone(d.phone) }))}
              placeholder="07XXXXXXXX, 01XXXXXXXX or 2547/2541XXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {!!payDialog.error && (
              <p className="text-red-600 text-sm mt-2">{payDialog.error}</p>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setPayDialog({ open: false, orderId: null, amount: 0, phone: '', error: '' })}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const normalized = normalizePhone(payDialog.phone);
                  if (!isValidKenyaMobile(normalized)) {
                    setPayDialog((d) => ({ ...d, error: 'Enter a valid Kenyan mobile (07/01/254).' }));
                    return;
                  }
                  setPayDialog((d) => ({ ...d, open: false }));
                  await handlePayment(payDialog.orderId, payDialog.amount, normalized);
                }}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
              >
                Send Payment Request
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Orders;