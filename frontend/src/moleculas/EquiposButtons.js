import React, { useState } from "react";
import BotonSinpleRojo from "../atomos/botonSinple";
import AsignarUsuarioPopup from "./AsignarUsuarioPopup";
import { printEquipo } from "../utils/printEquipo"; // Importar la función de impresión

const EquiposButtons = ({ setIsModalOpen, equipo, onEquiposUpdated, reloadEquipos, fetchEquipos }) => {
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);

  // Función para eliminar un equipo
  const handleDelete = async (equipo) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el equipo ${equipo.etiquetaEquipo}?`);
    if (confirmDelete) {
      try {
        const response = await fetch(`/equipo/${equipo.etiquetaEquipo}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el equipo');
        }

        alert('Equipo eliminado correctamente');
        onEquiposUpdated(); // Llamar a onEquiposUpdated después de eliminar
      } catch (error) {
        console.error(error);
        alert('Error al eliminar el equipo');
      }
    }
  };

  // Función para asignar un usuario a un equipo
  const handleAssign = async (equipo, usuario) => {
    try {
      const response = await fetch(`/equipo/${equipo.etiquetaEquipo}/asignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario }),
      });

      if (!response.ok) {
        throw new Error('Error al asignar el usuario');
      }

      alert('Usuario asignado correctamente');
      onEquiposUpdated();
      setIsAssignPopupOpen(false); 
    } catch (error) {
      console.error(error);
      alert('Error al asignar el usuario');
    }
  };

  return (
    <div className="botones-container">
      <div className="botones-fila">
        <BotonSinpleRojo label="Imprimir" onClick={() => printEquipo(equipo)} className="fade-in" />
        <BotonSinpleRojo
          label="Editar"
          onClick={() => setIsModalOpen(true)}
          className="fade-in"
        />
        <BotonSinpleRojo label="Asignar" onClick={() => setIsAssignPopupOpen(true)} className="fade-in" />
        <BotonSinpleRojo label="SAKA" onClick={() => handleDelete(equipo)} className="fade-in boton-saka" />
      </div>
      {isAssignPopupOpen && (
        <AsignarUsuarioPopup
          equipo={equipo}
          onClose={() => {
            setIsAssignPopupOpen(false);
            onEquiposUpdated();
          }}
          onAssign={handleAssign}
          reloadEquipos={reloadEquipos}
        />
      )}
    </div>
  );
};

export default EquiposButtons;