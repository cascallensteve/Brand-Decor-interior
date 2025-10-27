import React, { useEffect, useState } from 'react';
import { getAllContacts, getContactDetails } from '../../services/api';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone, FaUser, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { useAdminData } from '../../context/AdminDataContext';
import { useAuth } from '../../context/AuthContext';
import { PageBanner } from '../../admin';

const Contacts = () => {
  const { contacts: cachedContacts, setContacts: setCachedContacts } = useAdminData();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const { getToken } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Initialize from cache first
    if (Array.isArray(cachedContacts) && cachedContacts.length > 0) {
      setContacts(cachedContacts);
      setLoading(false);
    } else {
      fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const token = getToken?.();
      if (!token) {
        const msg = 'Please log in as admin to view contacts';
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }

      const contactsData = await getAllContacts(token);
      console.log('Contacts fetched:', Array.isArray(contactsData) ? contactsData.length : 'non-array', contactsData);
      setContacts(contactsData || []);
      setCachedContacts?.(contactsData || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      const msg = error.message || 'Failed to fetch contacts';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contactId) => {
    try {
      const token = getToken?.();
      if (!token) {
        toast.error('Please log in as admin to view contact details');
        return;
      }

      const contactDetails = await getContactDetails(contactId, token);
      setSelectedContact(contactDetails);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching contact details:', error);
      toast.error(error.message || 'Failed to fetch contact details');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter contacts based on search term and subject filter
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === '' || 
                          contact.subject?.toLowerCase().includes(filterSubject.toLowerCase());
    
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects for filter dropdown
  const uniqueSubjects = [...new Set(contacts.map(contact => contact.subject).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Inquiries</h1>
        <p className="text-gray-600">Manage customer contact inquiries and messages</p>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-4 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 flex items-start justify-between">
          <div>
            <p className="font-semibold">Unable to load contacts</p>
            <p className="text-sm mt-1">{errorMsg}</p>
          </div>
          <button onClick={fetchContacts} className="ml-4 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700">Retry</button>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchContacts}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaEnvelope className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaUser className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Unique Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(contacts.map(c => c.email)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FaFilter className="text-orange-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-900">{filteredContacts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message Preview
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
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <FaEnvelope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No contacts found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <FaUser className="text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1" />
                            {contact.email || 'N/A'}
                          </div>
                          {contact.phone_number && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaPhone className="mr-1" />
                              {contact.phone_number}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {contact.subject || 'No Subject'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {contact.message ? contact.message.substring(0, 100) + '...' : 'No message'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewContact(contact.id)}
                        className="text-orange-600 hover:text-orange-900 flex items-center"
                      >
                        <FaEye className="mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Contact Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FaUser className="text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedContact.full_name || 'N/A'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedContact.email || 'N/A'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedContact.phone_number || 'N/A'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{selectedContact.subject || 'No Subject'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg min-h-[120px]">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedContact.message || 'No message provided'}
                    </p>
                  </div>
                </div>

                {selectedContact.created_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submitted On
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{formatDate(selectedContact.created_at)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
