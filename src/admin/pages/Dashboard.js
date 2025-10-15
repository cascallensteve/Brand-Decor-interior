import React, { useMemo } from 'react';
import { FaBox, FaUsers, FaShoppingCart, FaDollarSign, FaDownload, FaCalendarWeek } from 'react-icons/fa';
import { useAdminData } from '../../context/AdminDataContext';

const Dashboard = () => {
  const { items, users, orders, loading, error } = useAdminData();

  const productCount = useMemo(() => (Array.isArray(items) ? items.length : 0), [items]);
  const userCount = useMemo(() => (Array.isArray(users) ? users.length : 0), [users]);

  // Helper function to get last 5 transactions
  const getLastFiveTransactions = (orders) => {
    console.log('🔍 Dashboard: Getting last 5 transactions from:', orders.length, 'orders');
    
    // Sort orders by date (most recent first) and take the first 5
    const sortedOrders = orders.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date || a.order_date || a.timestamp);
      const dateB = new Date(b.created_at || b.date || b.order_date || b.timestamp);
      return dateB - dateA; // Descending order (newest first)
    });
    
    const lastFive = sortedOrders.slice(0, 5);
    console.log('🔍 Dashboard: Last 5 transactions:', lastFive);
    return lastFive;
  };

  // Compute recent orders from cached orders (no extra fetches)
  const recentOrders = useMemo(() => {
    const list = Array.isArray(orders) ? orders.slice() : [];
    const sorted = list.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date || a.order_date || a.timestamp);
      const dateB = new Date(b.created_at || b.date || b.order_date || b.timestamp);
      return dateB - dateA;
    });
    return sorted.slice(0, 5);
  }, [orders]);
  const ordersLoading = loading; // share context loading state for simplicity

  // CSV Download function (alternative to PDF)
  const downloadOrdersCSV = () => {
    if (recentOrders.length === 0) return;
    
    // Prepare CSV headers
    const headers = ['Order ID', 'Customer', 'Date', 'Status', 'Total'];
    
    // Prepare CSV data
    const tableData = recentOrders.map(order => [
      order.id || order.order_id || 'N/A',
      `${order.user_name || order.customer_name || 
         (order.shipping?.first_name && order.shipping?.last_name ? 
          `${order.shipping.first_name} ${order.shipping.last_name}` : 'N/A')} (${order.user_email || order.customer_email || order.user?.email || order.shipping?.email || 'No email'})`,
      new Date(order.created_at || order.date || order.order_date).toLocaleDateString(),
      order.status || 'Pending',
      `KES ${(order.total_amount || order.total || 0).toLocaleString()}`
    ]);
    
    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...tableData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `brand-decor-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Print function for orders
  const printOrders = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Brand Decor - Recent Orders</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #ea580c; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #ea580c; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 20px; }
          .date { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Brand Decor - Recent Orders</h1>
          <p class="date">Last 7 Days | Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${recentOrders.map(order => `
              <tr>
                <td>#${order.id || order.order_id || 'N/A'}</td>
                <td>${order.user_name || order.customer_name || 'N/A'}</td>
                <td>${new Date(order.created_at || order.date || order.order_date).toLocaleDateString()}</td>
                <td>${order.status || 'Pending'}</td>
                <td>KES ${(order.total_amount || order.total || 0).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const stats = [
    { title: 'Total Products', value: productCount ?? '—', icon: <FaBox className="text-2xl text-blue-500" />, change: '' },
    { title: 'Total Users', value: userCount ?? '—', icon: <FaUsers className="text-2xl text-green-500" />, change: '' },
    { title: 'Recent Orders', value: recentOrders.length, icon: <FaShoppingCart className="text-2xl text-yellow-500" />, change: 'Last 5 transactions' },
    { title: 'Recent Revenue', value: `KES ${recentOrders.reduce((sum, order) => sum + (order.total_amount || order.total || 0), 0).toLocaleString()}`, icon: <FaDollarSign className="text-2xl text-purple-500" />, change: 'Last 5 transactions' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{loading ? 'Loading…' : stat.value}</p>
                {stat.change && <p className="mt-1 text-xs text-gray-500">{stat.change}</p>}
              </div>
              <div className="rounded-full bg-blue-50 p-3">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              <FaCalendarWeek className="mr-1" />
              Last 5 Transactions
            </span>
          </div>
          <div className="flex space-x-2">
            <div className="flex space-x-2">
              <button 
                onClick={downloadOrdersCSV}
                disabled={recentOrders.length === 0}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaDownload className="mr-2 h-4 w-4" />
                CSV
              </button>
              <button 
                onClick={printOrders}
                disabled={recentOrders.length === 0}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaDownload className="mr-2 h-4 w-4" />
                Print
              </button>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
        </div>
        
        {ordersLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <FaShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent orders</h3>
            <p className="mt-1 text-sm text-gray-500">No orders found in the last 7 days.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentOrders.map((order, index) => {
                  const orderDate = new Date(order.created_at || order.date || order.order_date);
                  const statusColor = {
                    'completed': 'bg-green-100 text-green-800',
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'processing': 'bg-blue-100 text-blue-800',
                    'cancelled': 'bg-red-100 text-red-800',
                    'shipped': 'bg-purple-100 text-purple-800'
                  };
                  
                  return (
                    <tr key={order.id || index} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.id || order.order_id || `ORD-${1000 + index}`}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.user_name || order.customer_name || order.user?.name || 
                             (order.shipping?.first_name && order.shipping?.last_name ? 
                              `${order.shipping.first_name} ${order.shipping.last_name}` : 'N/A')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.user_email || order.customer_email || order.user?.email || 
                             order.shipping?.email || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {orderDate.toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          statusColor[order.status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        KES ${(order.total_amount || order.total || 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
