import React from 'react';
import "./estilos/recentEquipos.css";

const RecentEquipos = ({ recentEquipos, handleRowClick, spinAnimationActive }) => {
  const maxEquiposToShow = 5; 
  const equiposToShow = recentEquipos.slice(0, maxEquiposToShow);

  const formatUsuario = (usuario) => {
    const words = usuario.split(' ');
    return words.length > 2 ? words.slice(0, 2).join(' ') : usuario;
  };

  return (
    <div className="recent-equipos-container">
      <h2>Equipos Recientemente Comprados</h2>
      {recentEquipos.length === 0 ? (
        <p>No hay equipos recientes.</p>
      ) : (
        <ul>
          {equiposToShow.map((equipo) => (
              <li
                key={equipo.id}
                onClick={() => handleRowClick(equipo)}
              >
              <span>{equipo.etiquetaEquipo}</span> - <span>{equipo.marca}</span> <span>{equipo.modelo}</span> - <span className="usuario-highlight">{formatUsuario(equipo.usuario)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentEquipos;