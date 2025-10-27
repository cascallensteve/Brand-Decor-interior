import React, { useState } from 'react';
import { FaSearch, FaUserPlus, FaEnvelope, FaPhone, FaUserEdit, FaUserTimes, FaFilter, FaDownload, FaEye, FaEyeSlash, FaSort, FaSortUp, FaSortDown, FaInfoCircle, FaArrowLeft, FaUsers } from 'react-icons/fa';
import { getUserDetails } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import UserDetailsModal from '../components/UserDetailsModal';
import { PageBanner } from '../../admin';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  // Use globally cached admin data
  const { users: cachedUsers, loading, error, refresh } = useAdminData();
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [retryCount, setRetryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const { getToken } = useAuth();

  // Use cached users from AdminDataContext; no per-tab fetching
  const users = Array.isArray(cachedUsers) ? cachedUsers : [];

  // Retry function
  const handleRetry = () => {
    if (retryCount < 3) {
      // Trigger a global refresh of cached data
      refresh?.();
      setRetryCount(prev => prev + 1);
    } else {
      window.location.href = '/login';
    }
  };

  // Handle viewing user details
  const handleViewUserDetails = async (user) => {
    try {
      setSelectedUser(user);
      setIsModalOpen(true);
      setModalLoading(true);
      setModalError(null);
      setUserDetails(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await getUserDetails(user.id, token);
      setUserDetails(response['user-details'] || response);
    } catch (err) {
      setModalError(err.message);
      console.error('Error fetching user details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUserDetails(null);
    setModalError(null);
  };

  // Filter and sort users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_no?.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || user.userType === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'verified' && user.is_email_verified) ||
      (filterStatus === 'unverified' && !user.is_email_verified);
    
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle name sorting
    if (sortField === 'name') {
      aValue = `${a.first_name || ''} ${a.last_name || ''}`.trim();
      bValue = `${b.first_name || ''} ${b.last_name || ''}`.trim();
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />;
  };

  // Download CSV
  const downloadCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'User Type', 'Email Verified'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.id,
        `"${user.first_name || ''}"`,
        `"${user.last_name || ''}"`,
        `"${user.email || ''}"`,
        `"${user.phone_no || ''}"`,
        `"${user.userType || ''}"`,
        user.is_email_verified ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics
  const stats = {
    total: users.length,
    verified: users.filter(u => u.is_email_verified).length,
    unverified: users.filter(u => !u.is_email_verified).length,
    admins: users.filter(u => u.userType === 'admin').length,
    clients: users.filter(u => u.userType === 'client').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Inline details view: hide list and show full section (except top/header from layout)
  if (isModalOpen) {
    const d = userDetails || selectedUser || {};
    const fullName = `${d.first_name || ''} ${d.last_name || ''}`.trim() || d.name || 'User';
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <button onClick={handleCloseModal} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="mr-2" />
              Back to Users
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                <p className="text-sm text-gray-500">View and manage user information</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold">
                {(d.first_name?.[0] || d.name?.[0] || 'U').toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-gray-500">Full Name</div>
                <div className="text-base font-medium text-gray-900">{fullName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-base text-gray-900 break-all">{d.email || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div className="text-base text-gray-900">{d.phone_no || d.phone || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Role</div>
                <div className="text-base text-gray-900 capitalize">{d.userType || d.role || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Email Verified</div>
                <div className="text-base">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${d.is_email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {d.is_email_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">User ID</div>
                <div className="text-base text-gray-900">{d.id || '—'}</div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button onClick={handleCloseModal} className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50">
                Back
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                Edit User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error loading users</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  {error.includes('Authentication failed') || error.includes('No authentication token') ? (
                    <p className="mt-2">Redirecting to login page...</p>
                  ) : (
                    <div className="mt-3">
                      <button
                        onClick={handleRetry}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {retryCount < 3 ? `Try Again (${retryCount}/3)` : 'Redirect to Login'}
                      </button>
                      {retryCount > 0 && retryCount < 3 && (
                        <p className="mt-2 text-xs text-red-600">
                          Attempt {retryCount} of 3. After 3 attempts, you'll be redirected to login.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={downloadCSV}
            className="flex items-center space-x-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <FaDownload className="h-4 w-4" />
            <span>Download CSV</span>
          </button>
          <button className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <FaUserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Users</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.total}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Verified</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">{stats.verified}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Unverified</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">{stats.unverified}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Admins</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">{stats.admins}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Clients</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-purple-600">{stats.clients}</dd>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    {getSortIcon('id')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {getSortIcon('email')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('phone_no')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Phone</span>
                    {getSortIcon('phone_no')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('userType')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {getSortIcon('userType')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('is_email_verified')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon('is_email_verified')}
                  </div>
                </th>
                <th scope="col" className="relative px-3 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {user.phone_no || 'N/A'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.userType === 'admin' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.userType || 'N/A'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_email_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_email_verified ? (
                        <>
                          <FaEye className="mr-1 h-3 w-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <FaEyeSlash className="mr-1 h-3 w-3" />
                          Unverified
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewUserDetails(user)}
                        className="text-green-600 hover:text-green-900"
                        title="View Details"
                      >
                        <FaInfoCircle className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" title="Edit User">
                        <FaUserEdit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete User">
                        <FaUserTimes className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userDetails={userDetails}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
}
