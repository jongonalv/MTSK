import React from "react";
import EquiposForm from "../moleculas/equiposForm";
import BotonSinpleRojo from "../atomos/botonSinple";

const EquiposModal = ({ isOpen, onClose, data, onChange, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal open">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Equipo</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <EquiposForm data={data} onChange={onChange} />
        </div>
        <div className="modal-footer">
          <BotonSinpleRojo label="Guardar" onClick={onSave} />
        </div>
      </div>
    </div>
  );
};

export default EquiposModal;