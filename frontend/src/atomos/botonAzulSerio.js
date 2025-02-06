import React from 'react';

const BlueButton = ({ onClick, children }) => {
  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#0056b3';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#007bff';
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default BlueButton;
