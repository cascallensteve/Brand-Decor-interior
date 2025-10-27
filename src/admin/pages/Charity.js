import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaSpinner, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { PageBanner } from '../../admin';

const AdminCharity = () => {
  const { user, getToken } = useAuth();
  const token = getToken();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCharityId, setDeleteCharityId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [selectedCharity, setSelectedCharity] = useState(null);

  // Log token to console for debugging
  useEffect(() => {
    if (token) {
      console.log('🔐 Authentication Token:', token);
      console.log('📋 User:', user);
      // Make token accessible in browser console
      window.authToken = token;
      window.authUser = user;
      console.log('✅ Token available as: window.authToken');
      console.log('✅ User available as: window.authUser');
    } else {
      console.warn('⚠️ No authentication token found');
    }
  }, [token, user]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: '',
    target_amount: '',
    donation_type: 'Education'
  });

  const donationTypes = ['Education', 'Healthcare', 'Food', 'Shelter', 'Emergency', 'Other'];

  // Fetch charities
  const fetchCharities = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://brand-decor-ecom-api.vercel.app/donations/list-charities', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCharities(data.charities || []);
      } else {
        toast.error('Failed to fetch charities');
      }
    } catch (error) {
      console.error('Error fetching charities:', error);
      toast.error('Error fetching charities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddCharity = async (e) => {
    e.preventDefault();

    // Validate title
    if (!formData.title || !formData.title.trim()) {
      toast.error('Please enter a charity title');
      return;
    }

    if (formData.title.length < 3) {
      toast.error('Charity title must be at least 3 characters');
      return;
    }

    if (formData.title.length > 200) {
      toast.error('Charity title must be less than 200 characters');
      return;
    }

    // Validate description
    if (!formData.description || !formData.description.trim()) {
      toast.error('Please enter a charity description');
      return;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    // Validate target amount
    if (!formData.target_amount || isNaN(formData.target_amount) || parseFloat(formData.target_amount) <= 0) {
      toast.error('Please enter a valid target amount (must be greater than 0)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        banner: formData.banner || 'https://via.placeholder.com/400x300?text=Charity',
        target_amount: formData.target_amount,
        donation_type: formData.donation_type
      };

      console.log('Sending payload:', payload);
      console.log('Token:', token);
      console.log('Authorization header:', `Bearer ${token}`);

      const headers = {
        'Content-Type': 'application/json'
      };

      // Add token to headers if it exists
      if (token) {
        // Admin requests use "Token" format, not "Bearer"
        headers['Authorization'] = `Token ${token}`;
        console.log('Using Authorization header: Token <token>');
      } else {
        console.warn('⚠️ No token found!');
        toast.error('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://brand-decor-ecom-api.vercel.app/donations/add-charity', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      console.log('Full response headers:', response.headers);

      if (response.ok) {
        setCharities([data.charity, ...charities]);
        
        toast.success(
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Charity Added Successfully!</p>
            <p>{data.charity.title}</p>
            <p>Target: KES {parseFloat(data.charity.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>,
          {
            position: 'top-center',
            autoClose: 4000,
          }
        );
        
        resetForm();
        setShowModal(false);
        await fetchCharities();
      } else {
        // Handle different error response formats
        let errorMsg = 'Failed to add charity';
        
        if (data.error) {
          if (typeof data.error === 'object') {
            // If error is an object with field errors
            const errors = Object.entries(data.error)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                }
                return `${field}: ${messages}`;
              })
              .join('\n');
            errorMsg = errors;
          } else {
            errorMsg = data.error;
          }
        } else if (data.detail) {
          errorMsg = data.detail;
        } else if (data.message) {
          errorMsg = data.message;
        }
        
        console.error('API Error:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error adding charity:', error);
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // View charity details
  const handleViewCharity = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://brand-decor-ecom-api.vercel.app/donations/charity-detail/${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedCharity(data.charity);
        setShowViewModal(true);
      } else {
        toast.error('Failed to fetch charity details');
      }
    } catch (error) {
      console.error('Error fetching charity:', error);
      toast.error('Error fetching charity details');
    } finally {
      setLoading(false);
    }
  };

  // Edit charity
  const handleEditCharity = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://brand-decor-ecom-api.vercel.app/donations/charity-detail/${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const charity = data.charity;
        setFormData({
          title: charity.title,
          description: charity.description,
          banner: charity.banner,
          target_amount: charity.target_amount,
          donation_type: charity.donation_type
        });
        setEditingId(id);
        setShowEditModal(true);
      } else {
        toast.error('Failed to fetch charity for editing');
      }
    } catch (error) {
      console.error('Error fetching charity:', error);
      toast.error('Error fetching charity');
    } finally {
      setLoading(false);
    }
  };

  // Update charity
  const handleUpdateCharity = async (e) => {
    e.preventDefault();

    if (!editingId) {
      toast.error('No charity selected for editing');
      return;
    }

    // Validate fields
    if (!formData.title || !formData.title.trim()) {
      toast.error('Please enter a charity title');
      return;
    }

    if (formData.title.length < 3) {
      toast.error('Charity title must be at least 3 characters');
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      toast.error('Please enter a charity description');
      return;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    if (!formData.target_amount || isNaN(formData.target_amount) || parseFloat(formData.target_amount) <= 0) {
      toast.error('Please enter a valid target amount (must be greater than 0)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        banner: formData.banner,
        target_amount: formData.target_amount
      };

      console.log('Updating charity with payload:', payload);

      const response = await fetch(`https://brand-decor-ecom-api.vercel.app/donations/edit-charity/${editingId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Update response status:', response.status);
      const data = await response.json();
      console.log('Update response data:', data);

      if (response.ok) {
        // Update the charity in the list
        setCharities(charities.map(c => c.id === editingId ? data.charity : c));
        
        toast.success(
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Charity Updated Successfully!</p>
            <p>{data.charity.title}</p>
            <p>Target: KES {parseFloat(data.charity.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>,
          {
            position: 'top-center',
            autoClose: 4000,
          }
        );
        
        resetForm();
        setShowEditModal(false);
        await fetchCharities();
      } else {
        const errorMsg = data.detail || data.message || data.error || 'Failed to update charity';
        console.error('API Error:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error updating charity:', error);
      toast.error('Error updating charity: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteCharityId(id);
    setShowDeleteConfirm(true);
  };

  // Confirm and delete charity
  const confirmDeleteCharity = async () => {
    if (!deleteCharityId) return;

    setLoading(true);
    try {
      const response = await fetch(`https://brand-decor-ecom-api.vercel.app/donations/delete-charity/${deleteCharityId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 204 || response.ok) {
        setCharities(charities.filter(charity => charity.id !== deleteCharityId));
        toast.success('Charity deleted successfully!');
        setShowDeleteConfirm(false);
        setDeleteCharityId(null);
      } else {
        toast.error('Failed to delete charity');
      }
    } catch (error) {
      console.error('Error deleting charity:', error);
      toast.error('Error deleting charity');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      banner: '',
      target_amount: '',
      donation_type: 'Education'
    });
    setEditingId(null);
    console.log('Form reset');
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Filter and search charities
  const filteredCharities = charities.filter(charity => {
    const matchesSearch = charity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || charity.donation_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const calculateProgress = (total, target) => {
    if (target === 0) return 0;
    return Math.min((parseFloat(total) / parseFloat(target)) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Show form or content based on modal state */}
      {showModal || showEditModal || showViewModal ? (
        // Add Charity Form Section or Edit Form or View Details
        showViewModal && selectedCharity ? (
          // View Details Section
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Charity Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCharity(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <img
                  src={selectedCharity.banner}
                  alt={selectedCharity.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Charity';
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900 font-semibold">{selectedCharity.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-700">{selectedCharity.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                  <p className="text-gray-900 font-semibold">KES {parseFloat(selectedCharity.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raised Amount</label>
                  <p className="text-gray-900 font-semibold">KES {parseFloat(selectedCharity.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Donation Type</label>
                <p className="text-gray-900 font-semibold">{selectedCharity.donation_type}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedCharity(null);
                  }}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Add/Edit Form Section
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={showEditModal ? handleUpdateCharity : handleAddCharity} className="space-y-6">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {showEditModal ? 'Edit Charity' : 'Add New Charity'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Charity Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Save the Elderly Fundraiser"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the charity campaign..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              ></textarea>
            </div>

            {/* Banner URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image URL
              </label>
              <input
                type="url"
                name="banner"
                value={formData.banner}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.banner && (
                <div className="mt-2">
                  <img
                    src={formData.banner}
                    alt="Preview"
                    className="h-32 w-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Target Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount ($) *
              </label>
              <input
                type="number"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleInputChange}
                placeholder="50000"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Donation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Type *
              </label>
              <select
                name="donation_type"
                value={formData.donation_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {donationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Form Footer */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {showEditModal ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {showEditModal ? (
                      <><FaEdit /> Update Charity</>
                    ) : (
                      <><FaPlus /> Add Charity</>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
            </div>
        )
      ) : (
        <>
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search charities by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {donationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredCharities.length} of {charities.length} charities
            </p>
          </div>

          {/* Charities Grid */}
          {loading && charities.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
          ) : filteredCharities.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FaHeart className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-600 text-lg">No charities found</p>
              <p className="text-gray-500 text-sm mt-2">
                {charities.length === 0 ? 'Start by adding your first charity campaign' : 'Try adjusting your search or filter'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCharities.map(charity => (
                <div key={charity.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Banner */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={charity.banner}
                      alt={charity.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Charity';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {charity.donation_type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{charity.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{charity.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">
                          {calculateProgress(charity.total_amount, charity.target_amount).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${calculateProgress(charity.total_amount, charity.target_amount)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Raised: KES {parseFloat(charity.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span>Target: KES {parseFloat(charity.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleViewCharity(charity.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditCharity(charity.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        <FaEdit className="text-sm" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(charity.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        <FaTrash className="text-sm" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View Charity Modal */}
          {showViewModal && selectedCharity && (
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Charity Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <img
                    src={selectedCharity.banner}
                    alt={selectedCharity.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Charity';
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900 font-semibold">{selectedCharity.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-700">{selectedCharity.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                    <p className="text-gray-900 font-semibold">KES {parseFloat(selectedCharity.target_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raised Amount</label>
                    <p className="text-gray-900 font-semibold">KES {parseFloat(selectedCharity.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donation Type</label>
                  <p className="text-gray-900 font-semibold">{selectedCharity.donation_type}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Charity Modal */}
          {showEditModal && editingId && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Charity</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleUpdateCharity} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Charity Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Save the Elderly Fundraiser"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the charity campaign..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount (KES)</label>
                  <input
                    type="number"
                    name="target_amount"
                    value={formData.target_amount}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Banner Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
                  <input
                    type="url"
                    name="banner"
                    value={formData.banner}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.banner && (
                    <div className="mt-2">
                      <img
                        src={formData.banner}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaEdit /> Update Charity
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <FaTrash className="text-red-600 text-xl" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Charity</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this charity? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteCharityId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCharity}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCharity;
