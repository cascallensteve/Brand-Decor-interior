import React from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';

export default function UserDetailsModal({ isOpen, onClose, userDetails, loading, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                User Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading user details...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaTimesCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {userDetails && !loading && !error && (
              <div className="space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xl font-semibold text-blue-600">
                        {`${userDetails.first_name?.[0] || ''}${userDetails.last_name?.[0] || ''}`.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {`${userDetails.first_name || ''} ${userDetails.last_name || ''}`.trim() || 'N/A'}
                    </h4>
                    <p className="text-sm text-gray-500">User ID: {userDetails.id}</p>
                  </div>
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Email */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{userDetails.email || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                      {userDetails.is_email_verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FaTimesCircle className="mr-1 h-3 w-3" />
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-sm text-gray-900">{userDetails.phone_no || 'N/A'}</p>
                    </div>
                  </div>

                  {/* User Type */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaShieldAlt className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">User Type</p>
                      <p className="text-sm text-gray-900 capitalize">{userDetails.userType || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userDetails.userType === 'admin' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {userDetails.userType || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
                      <p className="text-sm text-gray-900">
                        {userDetails.is_email_verified ? 'Active & Verified' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Account Information</h5>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• User ID: {userDetails.id}</p>
                    <p>• Email Verification: {userDetails.is_email_verified ? 'Completed' : 'Pending'}</p>
                    <p>• Account Type: {userDetails.userType === 'admin' ? 'Administrator' : 'Client'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
