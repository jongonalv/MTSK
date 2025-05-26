import React from "react";
import EquiposForm from "./FormularioEditarEquipos";
import { FiX, FiSave } from "react-icons/fi";
import './estilos/EquiposModal.css';
import { FiHardDrive } from "react-icons/fi";

const EquiposModal = ({ isOpen, onClose, data, onChange, onSave, reloadEquipos, fetchEquipos }) => {
  // Función para manejar el evento de guardar
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await onSave();
      await fetchEquipos();
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="em-modal-overlay">
      <div className="em-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="em-modal-header">
          <h2>
            <FiHardDrive className="em-icon" />
            Editar Equipo
          </h2>
          <button className="em-close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="em-form-container">
          <div className="em-modal-body">
            <EquiposForm data={data} onChange={onChange} />
          </div>
          
          <div className="em-modal-footer">
            <button type="submit" className="em-save-button">
              <FiSave className="em-button-icon" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EquiposModal);