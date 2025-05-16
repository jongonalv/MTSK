import React from 'react';
import './estilos/botones.css';

const BotonAgregar = ({ label, onClick }) => {
  return (
    <button className="button-agregar" onClick={onClick}>
      {label}
    </button>
  );
};

export default BotonAgregar;