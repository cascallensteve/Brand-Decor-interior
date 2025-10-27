import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SignupSuccessModal = ({ isOpen, onClose, email }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account created! 🎉
          </h2>

          <p className="text-gray-600 mb-4">
            We sent a verification code to
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="font-medium text-gray-900">{email}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Verify Email
          </button>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-orange-500 h-1 rounded-full animate-pulse" style={{ animation: 'shrink 3.5s linear forwards' }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Redirecting shortly…</p>
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

export default SignupSuccessModal;


