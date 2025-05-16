import React, { useState, useEffect } from 'react';
import './estilos/asignarUsuarioPopup.css';

const AsignarUsuarioPopup = ({ equipo, onClose, onAssign }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {

    // Fetch de la lista de usuarios
    // Se ejecuta al montar el componente
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3001/usuarios');
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  // Función para asignar un usuario al equipo
  const handleAssign = (user) => {
    onAssign(equipo, user.Usuario);
    onClose();
  };

  // Filtrar la lista de usuarios
  const filteredUsuarios = usuarios.filter(user =>
    user.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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