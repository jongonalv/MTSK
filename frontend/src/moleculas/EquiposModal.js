import React from "react";
import EquiposForm from "./FormularioEditarEquipos";
import BotonSinpleRojo from "../atomos/botonSinple";

const EquiposModal = ({ isOpen, onClose, data, onChange, onSave, reloadEquipos }) => {
  if (!isOpen) return null;

  const handleSave = async () => {
    await onSave();
    reloadEquipos();
    onClose();
  };

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
          <BotonSinpleRojo label="Guardar" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default EquiposModal;