import React from 'react';
import "./barraBusqueda.css"

const barraBusqueda = ({ searchTerm, handleSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar por etiqueta o marca..."
      value={searchTerm}
      onChange={handleSearchChange}
      className="search-input"
    />
  );
};

export default barraBusqueda;
