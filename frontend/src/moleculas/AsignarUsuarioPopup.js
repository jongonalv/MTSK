import React from 'react';
import './estilos/asignarUsuarioPopup.css';
import { useUsuariosSearch } from '../hooks/useUsuarios';

const AsignarUsuarioPopup = ({ equipo, onClose, onAssign, reloadEquipos }) => {
  const { searchTerm, setSearchTerm, filteredUsuarios } = useUsuariosSearch();

  const handleAssign = (user) => {
    onAssign(user);
    if (reloadEquipos) reloadEquipos();
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Asignar Usuario al Equipo</h2>
        <p><strong>Etiqueta Equipo:</strong> {equipo.etiquetaEquipo}</p>
        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm.length > 0 && filteredUsuarios.length > 0 && (
          <ul className="search-results">
            {filteredUsuarios.map((user) => (
              <li key={user.Usuario} onClick={() => handleAssign(user)}>
                {user.Nombre}
              </li>
            ))}
          </ul>
        )}
        <div className="popup-buttons">
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AsignarUsuarioPopup;