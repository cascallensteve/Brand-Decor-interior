import React, { useMemo, useState, useEffect } from 'react';
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
  FaSearch,
  FaFilter,
  FaDownload,
  FaEdit,
  FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getOrderDetails, updateOrderStatus, getItemDetails } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { PageBanner } from '../../admin';

const Orders = () => {
  const { getToken } = useAuth();
  const { orders: cachedOrders, loading, refresh } = useAdminData();
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({});
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [itemDetailsCache, setItemDetailsCache] = useState({});

  // Mock orders data for now - retained as fallback example (not used when cache exists)
  const mockOrders = [
    {
      id: 1,
      buyer: 2,
      status: 'pending',
      created_at: '2025-01-15T10:30:00Z',
      items: [
        { item: { id: 1, name: 'Modern Sofa', price: 25000 }, quantity: 1 },
        { item: { id: 2, name: 'Coffee Table', price: 15000 }, quantity: 2 }
      ],
      shipping: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '0712345678',
        address: '123 Main St',
        city: 'Nairobi',
        county: 'Nairobi',
        postal_code: '00100'
      },
      user: {
        id: 2,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_no: '0712345678',
        userType: 'user',
        is_email_verified: true
      },
      total: 55000
    },
    {
      id: 2,
      buyer: 3,
      status: 'processing',
      created_at: '2025-01-14T15:45:00Z',
      items: [
        { item: { id: 3, name: 'Dining Chair', price: 8000 }, quantity: 4 }
      ],
      shipping: {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: '0798765432',
        address: '456 Oak Ave',
        city: 'Mombasa',
        county: 'Mombasa',
        postal_code: '80100'
      },
      user: {
        id: 3,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone_no: '0798765432',
        userType: 'user',
        is_email_verified: true
      },
      total: 32000
    },
    {
      id: 3,
      buyer: 4,
      status: 'delivered',
      created_at: '2025-01-10T09:15:00Z',
      items: [
        { item: { id: 4, name: 'Bed Frame', price: 35000 }, quantity: 1 },
        { item: { id: 5, name: 'Mattress', price: 20000 }, quantity: 1 }
      ],
      shipping: {
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike@example.com',
        phone: '0723456789',
        address: '789 Pine St',
        city: 'Kisumu',
        county: 'Kisumu',
        postal_code: '40100'
      },
      user: {
        id: 4,
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike@example.com',
        phone_no: '0723456789',
        userType: 'user',
        is_email_verified: true
      },
      total: 55000
    }
  ];

  // Use cached orders from AdminDataContext; derive a list for rendering
  const orders = useMemo(() => Array.isArray(cachedOrders) ? cachedOrders : [], [cachedOrders]);

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

  // Prefetch item details (name, price, image) for orders list (when API returns only IDs)
  useEffect(() => {
    if (!Array.isArray(orders) || orders.length === 0) return;
    const ids = new Set();
    orders.forEach((o) => {
      (o?.items || []).forEach((it) => {
        const id = typeof it?.item === 'number'
          ? it.item
          : (typeof it?.item?.id === 'number' ? it.item.id : null);
        if (id && !itemDetailsCache[id]) ids.add(id);
      });
    });
    const toFetch = Array.from(ids).slice(0, 50);
    if (toFetch.length === 0) return;
    let cancelled = false;
    (async () => {
      const token = getToken?.();
      for (const id of toFetch) {
        try {
          const details = await getItemDetails(id, token);
          const name = details?.name || details?.title || details?.product_name || `Item ${id}`;
          const rawPrice = details?.regular_price ?? details?.price ?? details?.amount ?? details?.cost ?? details?.unit_price;
          const price = rawPrice != null ? parseFloat(rawPrice) : 0;
          const image = details?.photo || details?.image || details?.image_url || (Array.isArray(details?.images) ? (details.images[0]?.src || details.images[0]?.url || details.images[0]) : null);
          if (cancelled) break;
          setItemDetailsCache((prev) => ({ 
            ...prev, 
            [id]: {
              name,
              price: isNaN(price) ? 0 : price,
              image
            }
          }));
        } catch (_) {
          // ignore individual failures
        }
      }
    })();
    return () => { cancelled = true; };
  }, [orders]);

  // Resolve image URL and provide a non-flicker image component
  const PLACEHOLDER = '/placeholder-image.jpg';
  const resolveImageUrl = (url) => {
    if (!url || typeof url !== 'string') return PLACEHOLDER;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')) return url;
    if (url.startsWith('/')) return url;
    return url;
  };

  const ImageWithFallback = ({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false);
    const [imgSrc, setImgSrc] = useState(resolveImageUrl(src));
    return (
      <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
        {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
        <img
          src={imgSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            if (imgSrc !== PLACEHOLDER) setImgSrc(PLACEHOLDER);
          }}
          className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
      </div>
    );
  };

  // Item helpers to get name/price/image robustly, preferring cache
  const extractId = (it) => (typeof it?.item === 'number' ? it.item : (typeof it?.item?.id === 'number' ? it.item.id : null));
  const getItemName = (it) => {
    const id = extractId(it);
    const cached = id ? itemDetailsCache[id] : null;
    if (cached?.name) return cached.name;
    const fallback = it?.item?.name || it?.item?.title || it?.name || it?.title;
    if (fallback && String(fallback).trim() !== '') return fallback;
    return `Item ${id || ''}`.trim();
  };
  const getItemUnitPrice = (it) => {
    const id = extractId(it);
    const cached = id ? itemDetailsCache[id] : null;
    const raw = cached?.price ?? it?.item?.price ?? it?.price ?? it?.unit_price ?? 0;
    const price = parseFloat(raw);
    return isNaN(price) ? 0 : price;
  };
  const getItemImage = (it) => {
    const id = extractId(it);
    const cached = id ? itemDetailsCache[id] : null;
    const candidate = cached?.image || it?.item?.photo || it?.item?.image || it?.item?.image_url || it?.photo || it?.image || PLACEHOLDER;
    return resolveImageUrl(candidate);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Compute order total with multiple backend field fallbacks
  const calculateTotal = (order) => {
    if (!order) return 0;
    const num = (v) => (v != null && !isNaN(parseFloat(v)) ? parseFloat(v) : 0);
    // Common API fields
    const direct = num(order.total_price) || num(order.total_amount) || num(order.total) || num(order.amount);
    if (direct > 0) return direct;
    // Sum from items
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsTotal = items.reduce((sum, it) => {
      const price = num(it?.item?.price || it?.price || it?.unit_price);
      const qty = num(it?.quantity) || 1;
      return sum + price * qty;
    }, 0);
    const shipping = num(order.shipping_cost || order.shipping);
    const tax = num(order.tax_amount || order.tax);
    const total = itemsTotal + shipping + tax;
    return total > 0 ? total : 0;
  };

  const handleViewOrder = async (orderId) => {
    try {
      setDetailsLoading(true);
      const token = await getToken();
      const orderDetails = await getOrderDetails(orderId, token);

      // Enrich items with exact name, unit price, and image
      const enrichItems = async (items) => {
        const list = Array.isArray(items) ? items : [];
        return Promise.all(
          list.map(async (it) => {
            const id = extractId(it);
            let cached = id ? itemDetailsCache[id] : null;
            let details = null;
            if (!cached && id) {
              try {
                details = await getItemDetails(id, token);
              } catch (_) {}
            }
            const name = cached?.name || details?.name || details?.title || details?.product_name || it?.item?.name || it?.name || `Item ${id || ''}`.trim();
            const rawPrice =
              (cached?.price != null ? cached.price : undefined) ??
              details?.regular_price ?? details?.price ?? details?.amount ?? details?.cost ?? details?.unit_price ??
              it?.item?.price ?? it?.price ?? it?.unit_price ?? 0;
            const price = isNaN(parseFloat(rawPrice)) ? 0 : parseFloat(rawPrice);
            const imageCandidate =
              cached?.image ||
              details?.photo || details?.image || details?.image_url ||
              (Array.isArray(details?.images) ? (details.images[0]?.src || details.images[0]?.url || details.images[0]) : null) ||
              it?.item?.photo || it?.item?.image || it?.item?.image_url || it?.photo || it?.image || PLACEHOLDER;

            return {
              ...it,
              item: {
                ...(typeof it?.item === 'object' ? it.item : { id }),
                id,
                name,
                price,
                image: resolveImageUrl(imageCandidate),
              },
            };
          })
        );
      };

      const enrichedItems = await enrichItems(orderDetails.items);
      const enrichedOrder = { ...orderDetails, items: enrichedItems };
      setSelectedOrder(enrichedOrder);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error(`Failed to load order details: ${error.message}`);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setStatusUpdateLoading(prev => ({ ...prev, [orderId]: true }));
      const token = await getToken();
      
      await updateOrderStatus(orderId, newStatus, token);
      
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      
      // Refresh global cache so all tabs get updated once
      await refresh?.();
      
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(`Failed to update order status: ${error.message}`);
    } finally {
      setStatusUpdateLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrderForStatus(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleStatusChange = async () => {
    if (!selectedOrderForStatus || !newStatus) return;
    
    try {
      await handleStatusUpdate(selectedOrderForStatus.id, newStatus);
      setShowStatusModal(false);
      setSelectedOrderForStatus(null);
      setNewStatus('');
    } catch (error) {
      // Error already handled in handleStatusUpdate
    }
  };

  const validStatuses = [
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'completed',
    'cancelled',
    'refunded',
    'failed',
    'on_hold',
    'returned'
  ];

  const filteredOrders = orders.filter(order => {
    const name = `${order?.user?.first_name || order?.shipping?.first_name || ''} ${order?.user?.last_name || order?.shipping?.last_name || ''}`.trim();
    const email = order?.user?.email || order?.shipping?.email || '';
    const matchesSearch = 
      (order?.id?.toString() || '').includes(searchTerm) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'amount_high':
        return (b.total || 0) - (a.total || 0);
      case 'amount_low':
        return (a.total || 0) - (b.total || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaShoppingBag className="text-3xl text-orange-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-600">Manage and track all customer orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                <FaDownload className="mr-2" />
                Export Orders
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
            
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Amount: High to Low</option>
              <option value="amount_low">Amount: Low to High</option>
          </select>

            <div className="text-sm text-gray-600 flex items-center">
              <FaFilter className="mr-2" />
              {filteredOrders.length} of {orders.length} orders
            </div>
        </div>
      </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
              </tr>
            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {(order?.user?.first_name && order?.user?.last_name)
                              ? `${order.user.first_name} ${order.user.last_name}`
                              : (order?.shipping?.first_name || order?.shipping?.last_name
                                  ? `${order?.shipping?.first_name || ''} ${order?.shipping?.last_name || ''}`.trim()
                                  : 'N/A')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order?.user?.email || order?.shipping?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(() => {
                        const cnt = order?.items?.length || 0;
                        if (cnt === 0) return 'No items';
                        const first = order.items[0];
                        const name = getItemName(first);
                        const qty = first?.quantity || 1;
                        return `${name} (x${qty})${cnt > 1 ? ` +${cnt - 1} more` : ''}`;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      KES {calculateTotal(order).toLocaleString()}
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openStatusModal(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Update Status"
                        >
                          <FaEdit className="w-4 h-4" />
                    </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Order Items */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <ImageWithFallback
                            src={getItemImage(item)}
                            alt={getItemName(item)}
                            className="w-16 h-16 rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{getItemName(item)}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Unit Price: KES {(item.item?.price || item.price || 0).toLocaleString()}</p>
                            <p className="text-lg font-semibold text-orange-500">
                              Total: KES {(((item.item?.price || item.price || 0)) * (item.quantity || 1)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Shipping Information */}
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <FaUser className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">
                            {selectedOrder.user?.first_name} {selectedOrder.user?.last_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaEnvelope className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{selectedOrder.user?.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaPhone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{selectedOrder.user?.phone_no}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                      <div className="space-y-3">
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
                    </div>

                    {/* Order Summary */}
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-orange-500">
                          KES {selectedOrder.total?.toLocaleString() || 'N/A'}
                        </span>
            </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
        </div>
            </div>
        </div>
            </div>
        </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedOrderForStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Update Order Status
                  </h2>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaTimesCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Update status for Order #{selectedOrderForStatus.id}
                  </p>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {validStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusChange}
                    disabled={statusUpdateLoading[selectedOrderForStatus.id]}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 transition-colors flex items-center"
                  >
                    {statusUpdateLoading[selectedOrderForStatus.id] ? (
                      <>
                        <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;