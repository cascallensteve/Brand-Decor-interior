import React, { useState } from 'react';
import { FaSearch, FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle, FaEllipsisV } from 'react-icons/fa';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Sample orders data
  const orders = [
    {
      id: 'ORD-1001',
      customer: 'John Doe',
      date: '2023-06-15',
      status: 'Shipped',
      total: 349.98,
      items: 2,
      payment: 'Credit Card',
      tracking: '1Z999AA1234567890'
    },
    {
      id: 'ORD-1002',
      customer: 'Jane Smith',
      date: '2023-06-14',
      status: 'Processing',
      total: 129.99,
      items: 1,
      payment: 'PayPal',
      tracking: ''
    },
    {
      id: 'ORD-1003',
      customer: 'Robert Johnson',
      date: '2023-06-13',
      status: 'Delivered',
      total: 459.95,
      items: 3,
      payment: 'Credit Card',
      tracking: '1Z999BB1234567890'
    },
    {
      id: 'ORD-1004',
      customer: 'Emily Davis',
      date: '2023-06-12',
      status: 'Cancelled',
      total: 89.97,
      items: 1,
      payment: 'Credit Card',
      tracking: ''
    },
  ];

  const statuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'Processing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Shipped':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-blue-600">
                      <a href={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.id}
                      </a>
                    </div>
                    <div className="text-xs text-gray-500">{order.items} items</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.payment}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={getStatusBadge(order.status)}>
                      {order.status === 'Processing' && <FaBoxOpen className="mr-1 h-3 w-3" />}
                      {order.status === 'Shipped' && <FaTruck className="mr-1 h-3 w-3" />}
                      {order.status === 'Delivered' && <FaCheckCircle className="mr-1 h-3 w-3" />}
                      {order.status === 'Cancelled' && <FaTimesCircle className="mr-1 h-3 w-3" />}
                      {order.status}
                    </span>
                    {order.tracking && (
                      <div className="mt-1 text-xs text-gray-500">
                        Tracking: {order.tracking}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEllipsisV className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 p-1 text-blue-600">
              <FaBoxOpen className="h-3 w-3" />
            </div>
            Total Orders
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">1,234</dd>
          <dd className="mt-1 text-sm text-green-600">+12% from last month</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <div className="mr-2 h-5 w-5 rounded-full bg-yellow-100 p-1 text-yellow-600">
              <FaBoxOpen className="h-3 w-3" />
            </div>
            Processing
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">45</dd>
          <dd className="mt-1 text-sm text-yellow-600">+2 from yesterday</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <div className="mr-2 h-5 w-5 rounded-full bg-blue-100 p-1 text-blue-600">
              <FaTruck className="h-3 w-3" />
            </div>
            Shipped
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">28</dd>
          <dd className="mt-1 text-sm text-blue-600">+5 from yesterday</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="flex items-center text-sm font-medium text-gray-500">
            <div className="mr-2 h-5 w-5 rounded-full bg-green-100 p-1 text-green-600">
              <FaCheckCircle className="h-3 w-3" />
            </div>
            Delivered
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">1,161</dd>
          <dd className="mt-1 text-sm text-green-600">+23 from yesterday</dd>
        </div>
      </div>
    </div>
  );
}
