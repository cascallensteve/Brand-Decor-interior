import React from 'react';
import { FaPlus } from 'react-icons/fa';

const PageBanner = ({ title, subtitle, icon: Icon, buttonText, onButtonClick, token }) => {
  return (
    <>
      {/* Sticky Green Banner Header with Background Image */}
      <div 
        className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 shadow-lg z-30 -mt-6 -mb-2 bg-cover bg-center bg-blend-overlay"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/djksfayfu/image/upload/v1758518877/6248154_esmkro.jpg)',
          backgroundBlendMode: 'overlay',
          marginLeft: '32px',
          marginRight: '0px'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {Icon && <Icon className="text-red-300" />}
              {title}
            </h1>
            <p className="text-green-100 mt-1">{subtitle}</p>
            {token && (
              <p className="text-xs text-green-100 mt-2">
                🔐 Token: <span className="font-mono text-green-200 cursor-pointer hover:underline" onClick={() => {
                  navigator.clipboard.writeText(token);
                }}>
                  {token.substring(0, 20)}...
                </span>
              </p>
            )}
          </div>
          {buttonText && onButtonClick && (
            <button
              onClick={onButtonClick}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-green-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FaPlus /> {buttonText}
            </button>
          )}
        </div>
      </div>

      {/* Spacer to account for banner */}
      <div className="h-2"></div>
    </>
  );
};

export default PageBanner;
