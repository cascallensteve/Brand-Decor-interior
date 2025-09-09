import React from 'react';
import { FaBox, FaUsers, FaShoppingCart, FaDollarSign } from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    { title: 'Total Products', value: '1,234', icon: <FaBox className="text-2xl text-blue-500" />, change: '+12% from last month' },
    { title: 'Total Users', value: '5,678', icon: <FaUsers className="text-2xl text-green-500" />, change: '+8% from last month' },
    { title: 'Total Orders', value: '2,345', icon: <FaShoppingCart className="text-2xl text-yellow-500" />, change: '+15% from last month' },
    { title: 'Total Revenue', value: '$45,678', icon: <FaDollarSign className="text-2xl text-purple-500" />, change: '+20% from last month' },
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
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-xs text-green-600">{stat.change}</p>
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
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
        </div>
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
              {[1, 2, 3, 4, 5].map((order) => (
                <tr key={order} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">#ORD-{1000 + order}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">Customer {order}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">2023-09-{10 + order}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">${(100 + order * 20).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
