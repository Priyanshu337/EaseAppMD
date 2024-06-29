import React from 'react';
import './CategoryBox.css'; 

const CategoryBox = ({ category, image, onClick, selected }) => {
  const handleClick = () => {
    onClick(category);
  };

  return (
    <div
      className={`category-box ${selected ? 'selected-category' : ''}`}
      onClick={handleClick}
    >
      <img src={image} alt={category} className="category-image" />
      <h3>{category}</h3>
    </div>
  );
};

export default CategoryBox;
