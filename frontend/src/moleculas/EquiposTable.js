import React from 'react';
import "./estilos/tablas.css";

const EquiposTable = ({ filteredEquipos, handleRowClick }) => {
  return (
    <div className="table-container">
      <table className="equipos-table">
        <thead>
          <tr>
            <th>Etiqueta</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {filteredEquipos.length > 0 ? (
            filteredEquipos.map((equipo) => (
              <tr key={equipo.etiquetaEquipo} onClick={() => handleRowClick(equipo)} className="clickable-row">
                <td>{equipo.etiquetaEquipo}</td>
                <td>{equipo.marca}</td>
                <td>{equipo.modelo}</td>
                <td>{equipo.tipo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-results">No se encontraron equipos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EquiposTable;