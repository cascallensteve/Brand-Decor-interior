import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose, userName, userEmail }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          {/* Welcome Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! 🎉
          </h2>
          
          <p className="text-gray-600 mb-4">
            You've successfully signed in to your account
          </p>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Signed in as:</p>
            <p className="font-medium text-gray-900">{userEmail}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Auto-close indicator */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-orange-500 h-1 rounded-full animate-pulse" style={{
                animation: 'shrink 3s linear forwards'
              }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">This will close automatically in 3 seconds</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
