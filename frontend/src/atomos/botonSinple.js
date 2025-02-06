import React from 'react';
import './botones.css';  // Importamos el archivo de estilos

const BotonSinpleRojo = ({ label, onClick }) => {
  return (
    <button className="button-etiqueta" onClick={onClick}>
      {label}
    </button>
  );
};

export default BotonSinpleRojo;
