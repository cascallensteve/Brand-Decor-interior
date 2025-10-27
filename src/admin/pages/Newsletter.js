import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUsers, FaCalendarAlt, FaEye, FaEdit, FaTrash, FaPlus, FaPaperPlane, FaDownload, FaSearch, FaFilter, FaMailBulk } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { PageBanner } from '../../admin';
import { useAuth } from '../../context/AuthContext';

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('newsletters');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Newsletter form state
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    scheduled_date: '',
    status: 'draft'
  });

  // Mock data for newsletters
  const mockNewsletters = [
    {
      id: 1,
      subject: 'New Furniture Collection Launch',
      content: 'Discover our latest collection of modern furniture pieces...',
      status: 'sent',
      created_at: '2025-09-15T10:00:00Z',
      sent_at: '2025-09-15T14:00:00Z',
      recipients: 1250,
      open_rate: 68.5,
      click_rate: 12.3
    },
    {
      id: 2,
      subject: 'Exclusive Weekend Sale - 30% Off',
      content: 'Don\'t miss our biggest sale of the year...',
      status: 'scheduled',
      created_at: '2025-09-14T09:30:00Z',
      scheduled_date: '2025-09-17T08:00:00Z',
      recipients: 1250,
      open_rate: 0,
      click_rate: 0
    },
    {
      id: 3,
      subject: 'Interior Design Tips & Trends',
      content: 'Transform your space with these expert tips...',
      status: 'draft',
      created_at: '2025-09-13T16:20:00Z',
      sent_at: null,
      recipients: 0,
      open_rate: 0,
      click_rate: 0
    }
  ];

  // Mock data for subscribers
  const mockSubscribers = [
    {
      id: 1,
      email: 'john.doe@email.com',
      name: 'John Doe',
      status: 'active',
      subscribed_at: '2025-08-15T10:30:00Z',
      last_activity: '2025-09-14T14:20:00Z'
    },
    {
      id: 2,
      email: 'sarah.johnson@email.com',
      name: 'Sarah Johnson',
      status: 'active',
      subscribed_at: '2025-08-20T11:15:00Z',
      last_activity: '2025-09-13T09:45:00Z'
    },
    {
      id: 3,
      email: 'mike.brown@email.com',
      name: 'Mike Brown',
      status: 'unsubscribed',
      subscribed_at: '2025-07-10T14:30:00Z',
      last_activity: '2025-08-25T16:10:00Z'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual API calls
        setTimeout(() => {
          setNewsletters(mockNewsletters);
          setSubscribers(mockSubscribers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'unsubscribed': return 'bg-red-100 text-red-800';
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

  const handleCreateNewsletter = async () => {
    if (!newsletterForm.subject.trim() || !newsletterForm.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Replace with actual API call
      const newNewsletter = {
        id: newsletters.length + 1,
        ...newsletterForm,
        created_at: new Date().toISOString(),
        recipients: subscribers.filter(s => s.status === 'active').length,
        open_rate: 0,
        click_rate: 0
      };

      setNewsletters([newNewsletter, ...newsletters]);
      setShowCreateModal(false);
      setNewsletterForm({ subject: '', content: '', scheduled_date: '', status: 'draft' });
      toast.success('Newsletter created successfully');
    } catch (error) {
      console.error('Error creating newsletter:', error);
      toast.error('Failed to create newsletter');
    }
  };

  const handleSendNewsletter = async (newsletterId) => {
    try {
      const updatedNewsletters = newsletters.map(newsletter =>
        newsletter.id === newsletterId
          ? { ...newsletter, status: 'sent', sent_at: new Date().toISOString() }
          : newsletter
      );
      setNewsletters(updatedNewsletters);
      toast.success('Newsletter sent successfully');
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Failed to send newsletter');
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Status', 'Subscribed Date', 'Last Activity'].join(','),
      ...subscribers.map(subscriber => [
        subscriber.id,
        `"${subscriber.name}"`,
        subscriber.email,
        subscriber.status,
        formatDate(subscriber.subscribed_at),
        formatDate(subscriber.last_activity)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = activeTab === 'newsletters' 
    ? newsletters.filter(item => 
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || item.status === filterStatus)
      )
    : subscribers.filter(item => 
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         item.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === 'all' || item.status === filterStatus)
      );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Management</h1>
        <div className="flex space-x-3">
          {activeTab === 'subscribers' && (
            <button
              onClick={exportSubscribers}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaDownload className="mr-2" />
              Export Subscribers
            </button>
          )}
          {activeTab === 'newsletters' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Create Newsletter
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaEnvelope className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Newsletters</p>
              <p className="text-2xl font-semibold text-gray-900">{newsletters.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaUsers className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {subscribers.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaPaperPlane className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sent This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {newsletters.filter(n => n.status === 'sent').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaEye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Open Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {newsletters.filter(n => n.status === 'sent').length > 0 
                  ? (newsletters.filter(n => n.status === 'sent').reduce((sum, n) => sum + n.open_rate, 0) / 
                     newsletters.filter(n => n.status === 'sent').length).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('newsletters')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'newsletters'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Newsletters
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'subscribers'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subscribers
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                {activeTab === 'newsletters' ? (
                  <>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                  </>
                ) : (
                  <>
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </>
                )}
              </select>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredData.length} of {activeTab === 'newsletters' ? newsletters.length : subscribers.length} {activeTab}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading {activeTab}...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaEnvelope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No {activeTab} found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {activeTab === 'newsletters' ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscriber</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {activeTab === 'newsletters' ? (
                        <>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.subject}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{item.content}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.recipients}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.open_rate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-orange-600 hover:text-orange-900 mr-3">
                              <FaEye />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <FaEdit />
                            </button>
                            {item.status === 'draft' && (
                              <button
                                onClick={() => handleSendNewsletter(item.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaPaperPlane />
                              </button>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.subscribed_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.last_activity)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Newsletter Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Newsletter</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={newsletterForm.subject}
                    onChange={(e) => setNewsletterForm({...newsletterForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Newsletter subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    value={newsletterForm.content}
                    onChange={(e) => setNewsletterForm({...newsletterForm, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Newsletter content..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={newsletterForm.status}
                      onChange={(e) => setNewsletterForm({...newsletterForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                  
                  {newsletterForm.status === 'scheduled' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date</label>
                      <input
                        type="datetime-local"
                        value={newsletterForm.scheduled_date}
                        onChange={(e) => setNewsletterForm({...newsletterForm, scheduled_date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewsletter}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
