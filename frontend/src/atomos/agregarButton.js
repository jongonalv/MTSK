import React from 'react';
import './botones.css';  // Importamos el archivo de estilos

const botonAgregar = ({ label, onClick }) => {
  return (
    <button className="button-agregar" onClick={onClick}>
      {label}
    </button>
  );
};

export default botonAgregar;
