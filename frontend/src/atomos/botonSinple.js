import React from 'react';
import './estilos/botones.css';

const BotonSinpleRojo = ({ label, onClick }) => {
  return (
    <button className="button-etiqueta" onClick={onClick}>
      {label}
    </button>
  );
};

export default BotonSinpleRojo;
