import React from 'react';

const StarRating = ({ rating, onRatingChange }) => {
  const handleStarClick = (index) => {
    onRatingChange(index + 1); // index is 0-based, rating should start from 1
  };

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        return (
          <i
            key={index}
            className={`fa-star ${rating > index ? 'fas' : 'far'}`}
            onClick={() => handleStarClick(index)}
            style={{ cursor: 'pointer', color: '#FFD700' }} // Gold color
          ></i>
        );
      })}
    </div>
  );
};

export default StarRating;
