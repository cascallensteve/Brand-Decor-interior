import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { rateItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const InteractiveStarRating = ({ 
  itemId, 
  currentRating = 0, 
  reviews = 0, 
  showReviews = false, 
  onRatingSubmitted = null,
  disabled = false,
  size = 'md' 
}) => {
  const [rating, setRating] = useState(currentRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, getToken } = useAuth();

  // Update rating when currentRating prop changes
  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleStarClick = async (starRating) => {
    if (disabled || isSubmitting || !user) {
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
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      
      console.log('🌟 Submitting rating:', { itemId, rating: starRating });
      
      const response = await rateItem(itemId, starRating, token);
      
      // Update local rating state
      setRating(starRating);
      
      // Show success celebration
      toast.success('🎉 Rating submitted successfully!', {
        position: "top-right",
        autoClose: 4000,
        style: {
          background: '#10B981',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '12px 20px'
        }
      });

      // Call callback if provided
      if (onRatingSubmitted) {
        onRatingSubmitted(response);
      }

    } catch (error) {
      console.error('❌ Error submitting rating:', error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (starRating) => {
    if (!disabled && !isSubmitting) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && !isSubmitting) {
      setHoveredRating(0);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="flex items-center space-x-1 mb-3">
      <div className="flex space-x-1" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isClickable = !disabled && !isSubmitting && user;
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              disabled={!isClickable}
              className={`${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} 
                         transition-all duration-200 transform ${
                           isSubmitting ? 'opacity-50' : ''
                         }`}
            >
              {isFilled ? (
                <FaStar 
                  className={`${sizeClasses[size]} text-orange-400 ${
                    isClickable ? 'hover:text-orange-500' : ''
                  } transition-colors duration-200`}
                />
              ) : (
                <FaRegStar 
                  className={`${sizeClasses[size]} text-gray-300 ${
                    isClickable ? 'hover:text-orange-300' : ''
                  } transition-colors duration-200`}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {showReviews && (
        <span className="text-gray-500 text-sm ml-2">
          ({reviews} customer reviews)
        </span>
      )}
      
      {isSubmitting && (
        <span className="text-orange-500 text-sm ml-2 animate-pulse">
          Submitting...
        </span>
      )}
      
      {!user && !disabled && (
        <span className="text-gray-400 text-sm ml-2">
          (Login to rate)
        </span>
      )}
    </div>
  );
};

export default InteractiveStarRating;
