import React, { useEffect, useState } from 'react';
import { FaSearch, FaEye, FaReply, FaTrash, FaFilter, FaDownload, FaEnvelope, FaPhone, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllContacts } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';

const Inquiries = () => {
  const { contacts: cachedContacts, inquiries: cachedInquiries, setContacts: setCachedContacts, setInquiries: setCachedInquiries } = useAdminData();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // If cached inquiries exist, use them
        if (Array.isArray(cachedInquiries) && cachedInquiries.length > 0) {
          setInquiries(cachedInquiries);
          return;
        }
        // Else, if cached contacts exist, transform them
        if (Array.isArray(cachedContacts) && cachedContacts.length > 0) {
          const transformed = cachedContacts.map(contact => ({
            id: contact.id,
            name: contact.full_name,
            email: contact.email,
            phone: contact.phone_number,
            subject: contact.subject,
            message: contact.message,
            status: 'new',
            created_at: contact.created_at || new Date().toISOString(),
            replied_at: null,
            priority: 'medium',
          }));
          setInquiries(transformed);
          setCachedInquiries?.(transformed);
          return;
        }
        // Otherwise fetch contacts once and cache
        const token = user?.token || null;
        if (!token) {
          setLoading(false);
          return;
        }
        const contacts = await getAllContacts(token);
        setCachedContacts?.(contacts || []);
        const transformed = (contacts || []).map(contact => ({
          id: contact.id,
          name: contact.full_name,
          email: contact.email,
          phone: contact.phone_number,
          subject: contact.subject,
          message: contact.message,
          status: 'new',
          created_at: contact.created_at || new Date().toISOString(),
          replied_at: null,
          priority: 'medium',
        }));
        setInquiries(transformed);
        setCachedInquiries?.(transformed);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        toast.error('Failed to load inquiries: ' + error.message);
        setInquiries([]);
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || inquiry.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
    setReplyText('');
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      setReplyLoading(true);
      // Replace with actual API call
      setTimeout(() => {
        // Update inquiry status
        const updatedInquiries = inquiries.map(inquiry =>
          inquiry.id === selectedInquiry.id
            ? { ...inquiry, status: 'replied', replied_at: new Date().toISOString() }
            : inquiry
        );
        setInquiries(updatedInquiries);
        toast.success('Reply sent successfully');
        setShowModal(false);
        setReplyLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
      setReplyLoading(false);
    }
  };

  const handleStatusChange = (inquiryId, newStatus) => {
    const updatedInquiries = inquiries.map(inquiry =>
      inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
    );
    setInquiries(updatedInquiries);
    toast.success('Status updated successfully');
  };

  const exportInquiries = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Status', 'Priority', 'Created', 'Replied'].join(','),
      ...filteredInquiries.map(inquiry => [
        inquiry.id,
        `"${inquiry.name}"`,
        inquiry.email,
        inquiry.phone,
        `"${inquiry.subject}"`,
        inquiry.status,
        inquiry.priority,
        formatDate(inquiry.created_at),
        inquiry.replied_at ? formatDate(inquiry.replied_at) : 'Not replied'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
        <button
          onClick={exportInquiries}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          <FaDownload className="mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {filteredInquiries.length} of {inquiries.length} inquiries
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaEnvelope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>No inquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                            <div className="text-sm text-gray-500">{inquiry.email}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{inquiry.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{inquiry.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getStatusColor(inquiry.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(inquiry.priority)}`}>
                        {inquiry.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(inquiry.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewInquiry(inquiry)}
                        className="text-orange-600 hover:text-orange-900 mr-3"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleViewInquiry(inquiry)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaReply />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Inquiry Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInquiry.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedInquiry.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInquiry.subject}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedInquiry.message}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Type your reply here..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={replyLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {replyLoading ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
