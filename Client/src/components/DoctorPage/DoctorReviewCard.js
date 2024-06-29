import React from 'react';
import './DoctorReviewCard.css';

const DoctorReviewCard = ({ name, reviewText, rating }) => {
  const renderStars = () => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-card">
      <div className="review-header">      
        <div className="reviewer-info">
          <h3 className="reviewer-name">{name}</h3>
          {/* Remove the date */}
        </div>
      </div>
      <div className="review-content">
        <p>{reviewText}</p>
      </div>
      <div className="review-rating">{renderStars()}</div>
    </div>
  );
};

export default DoctorReviewCard;
