import React from 'react';
import "./recentEquipos.css";

const RecentEquipos = ({ recentEquipos, handleRowClick, spinAnimationActive }) => {
  return (
    <div className="recent-equipos-container">
      <h2>Equipos Recientemente Añadidos</h2>
      {recentEquipos.length === 0 ? (
        <p>No hay equipos recientes.</p>
      ) : (
        <ul>
          {recentEquipos.map((equipo) => (
            <li
              key={equipo.id}
              className={spinAnimationActive ? 'spin-animation' : ''}
              onClick={() => handleRowClick(equipo)}
            >
              <span>{equipo.etiquetaEquipo}</span> - <span>{equipo.marca}</span> <span>{equipo.modelo}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentEquipos;