import React, { useState } from 'react';
import { FaSearch, FaUserPlus, FaEnvelope, FaPhone, FaUserEdit, FaUserTimes, FaFilter } from 'react-icons/fa';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample user data
  const users = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'Active',
      joinDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '+1 (555) 765-4321',
      role: 'Customer',
      status: 'Active',
      joinDate: '2023-02-20'
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      phone: '+1 (555) 987-6543',
      role: 'Customer',
      status: 'Inactive',
      joinDate: '2023-03-10'
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <FaUserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                  <img
                    className="h-full w-full object-cover"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt={user.name}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <div className="ml-auto">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2 h-4 w-4 text-gray-400" />
                  <a href={`mailto:${user.email}`} className="hover:text-blue-600 hover:underline">
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{user.phone}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Member since {new Date(user.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <FaUserEdit className="mr-2 h-4 w-4" />
                  Edit
                </button>
                <button className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  <FaUserTimes className="mr-2 h-4 w-4" />
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Users</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">1,234</dd>
          <dd className="mt-1 text-sm text-green-600">+12% from last month</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Users</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">1,023</dd>
          <dd className="mt-1 text-sm text-green-600">+8% from last month</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">New Signups</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">156</dd>
          <dd className="mt-1 text-sm text-green-600">+24% from last month</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Avg. Session</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">4m 32s</dd>
          <dd className="mt-1 text-sm text-red-600">-2% from last month</dd>
        </div>
      </div>
    </div>
  );
}
