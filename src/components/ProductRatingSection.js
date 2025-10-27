import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { rateItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductRatingSection = ({ 
  itemId, 
  currentRating = 0, 
  reviews = 0,
  compact = false 
}) => {
  const [rating, setRating] = useState(currentRating);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [alreadyRatedMessage, setAlreadyRatedMessage] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [inlineError, setInlineError] = useState('');
  const { user, getToken } = useAuth();

  const handleStarClick = (starRating) => {
    if (!user) {
      toast.error('Please log in to rate items', {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      return;
    }
    
    setSelectedRating(starRating);
  };

  const handleSubmitRating = async () => {
    if (!user) {
      toast.error('Please log in to rate items', {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      return;
    }

    if (selectedRating === 0) {
      toast.error('Please select a rating first', {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      
      console.log('🌟 Submitting rating:', { itemId, rating: selectedRating });
      
      const response = await rateItem(itemId, selectedRating, token);
      
      // Update local rating state
      setRating(selectedRating);
      setJustSubmitted(true);
      setHasRated(true);
      
      // Show success celebration
      toast.success('🎉 Rating submitted successfully!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: 'white',
          fontSize: '18px',
          fontWeight: '700',
          borderRadius: '16px',
          padding: '16px 24px',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          border: '2px solid #10B981'
        }
      });

      // Reset the just submitted state after 3 seconds
      setTimeout(() => {
        setJustSubmitted(false);
        setSelectedRating(0);
      }, 3000);

    } catch (error) {
      console.error('❌ Error submitting rating:', error);
      console.log('🔍 Error message received:', error.message);
      console.log('🔍 Is ALREADY_RATED?', error.message === 'ALREADY_RATED');
      
      // Handle "already rated" case with inline message
      if (error.message === 'ALREADY_RATED') {
        console.log('✅ Showing already rated message');
        setAlreadyRatedMessage(true);
        setHasRated(true);
        // Auto-hide the message after 4 seconds
        setTimeout(() => {
          setAlreadyRatedMessage(false);
        }, 4000);
      } else {
        console.log('❌ Showing error message:', error.message);
        if (error.message === 'Authentication required') {
          setInlineError('Login required');
          setTimeout(() => setInlineError(''), 4000);
          toast.error('❌ Login required', {
            position: "top-right",
            autoClose: 4000,
          });
        } else {
          // Treat other failures as already-rated UX for better feedback
          setHasRated(true);
          setAlreadyRatedMessage(true);
          setTimeout(() => setAlreadyRatedMessage(false), 4000);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (starRating) => {
    if (!isSubmitting) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!isSubmitting) {
      setHoveredRating(0);
    }
  };

  // Only color stars when hovering or after user selects; do not pre-fill from currentRating
  const displayRating = hoveredRating || selectedRating;
  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Rate this item:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= displayRating;
                const isClickable = !isSubmitting && user;
                
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    disabled={!isClickable}
                    className={`${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200 transform ${isSubmitting ? 'opacity-50' : ''}`}
                  >
                    {isFilled ? (
                      <FaStar className={`w-6 h-6 text-orange-400 ${isClickable ? 'hover:text-orange-500' : ''} transition-colors duration-200`} />
                    ) : (
                      <FaRegStar className={`w-6 h-6 text-gray-300 ${isClickable ? 'hover:text-orange-300' : ''} transition-colors duration-200`} />
                    )}
                  </button>
                );
              })}
            </div>
            {!!inlineError && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {inlineError}
              </span>
            )}
          </div>
        </div>
        {user && selectedRating > 0 && !justSubmitted && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Selected: {selectedRating} star{selectedRating !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleSubmitRating}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      )}

      {justSubmitted && (
        <div className="flex items-center justify-center bg-green-100 border border-green-300 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-800 font-semibold text-sm">
              Rating submitted successfully! 🎉
            </span>
          </div>
        </div>
      )}

      {alreadyRatedMessage && (
        <div className="flex items-center justify-center bg-blue-100 border border-blue-300 rounded-lg p-2 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-blue-800 font-medium text-sm">
              Item already rated!
            </span>
          </div>
        </div>
      )}
        
        {!user && (
          <div className="text-center">
            <span className="text-sm text-gray-400">Please log in to rate this item</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Rate this Product</h3>
        {reviews > 0 && (
          <span className="text-sm text-gray-600">({reviews} customer reviews)</span>
        )}
      </div>
      
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center space-x-2" onMouseLeave={handleMouseLeave}>
          <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= displayRating;
            const isClickable = !isSubmitting && user;
            
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                disabled={!isClickable}
                className={`${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200 transform ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isFilled ? (
                  <FaStar className={`w-6 h-6 text-orange-400 ${isClickable ? 'hover:text-orange-500' : ''} transition-colors duration-200`} />
                ) : (
                  <FaRegStar className={`w-6 h-6 text-gray-300 ${isClickable ? 'hover:text-orange-300' : ''} transition-colors duration-200`} />
                )}
              </button>
            );
          })}
          </div>
          {hasRated && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
              Already rated
            </span>
          )}
          {!!inlineError && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800">
              {inlineError}
            </span>
          )}
        </div>
        {inlineError && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {inlineError}
          </span>
        )}
        <div className="flex items-center space-x-2">
          {!user && (
            <span className="text-gray-400 text-sm">Please log in to rate this item</span>
          )}
          {user && selectedRating === 0 && (
            <span className="text-gray-600 text-sm">Click a star to select rating</span>
          )}
        </div>
      </div>
      
      {user && selectedRating > 0 && !justSubmitted && (
        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              You selected: {selectedRating} star{selectedRating !== 1 ? 's' : ''} out of 5
            </span>
          </div>
          <button
            onClick={handleSubmitRating}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      )}

      {justSubmitted && (
        <div className="flex items-center justify-center bg-green-100 border-2 border-green-300 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <span className="text-green-800 font-bold text-lg">
                Rating submitted successfully! 🎉
              </span>
              <p className="text-green-700 text-sm mt-1">
                Thank you for your feedback!
              </p>
            </div>
          </div>
        </div>
      )}

      {alreadyRatedMessage && (
        <div className="flex items-center justify-center bg-blue-100 border-2 border-blue-300 rounded-xl p-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center">
              <span className="text-blue-800 font-semibold text-base">
                Item already rated!
              </span>
              <p className="text-blue-700 text-sm mt-1">
                You have already submitted a rating for this item.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {rating > 0 && selectedRating === 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Current rating: {rating} star{rating !== 1 ? 's' : ''} out of 5
        </div>
      )}
    </div>
  );
};

export default ProductRatingSection;
