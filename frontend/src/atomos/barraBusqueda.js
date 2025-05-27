import React from 'react';
import './estilos/barraBusqueda.css';

const BarraBusqueda = ({ searchTerm, handleSearchChange }) => {
  const handleChange = (e) => {
    handleSearchChange(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Buscar..."
      value={searchTerm}
      onChange={handleChange}
      className="search-input"
    />
  );
};

export default BarraBusqueda;