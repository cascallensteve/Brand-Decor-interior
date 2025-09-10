import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">Name</div>
        <div className="text-lg font-semibold">{user.first_name || ''} {user.last_name || ''}</div>
        <div className="text-sm text-gray-600 mt-4">Email</div>
        <div className="text-lg">{user.email}</div>
        <div className="text-sm text-gray-600 mt-4">Role</div>
        <div className="text-lg">{user.userType || user.role || 'admin'}</div>
      </div>
    </div>
  );
};

export default AdminProfile;
