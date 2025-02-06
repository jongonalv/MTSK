import React from 'react';

const DateFilter = ({ selectedDate, handleDateChange }) => {
  return (
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => handleDateChange(e.target.value)}
      className="date-filter"
    />
  );
};

export default DateFilter;