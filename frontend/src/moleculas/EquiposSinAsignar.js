import React, { useEffect, useState } from 'react';
import './estilos/EquiposSinAsignarPopup.css';

const EquiposSinAsignar = ({ onClose }) => {
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        // 1. Obtener todos los equipos
        const resEquipos = await fetch('/equipos');
        const equipos = await resEquipos.json();

        // 2. Obtener etiquetas de equipos asignados
        const resAsignados = await fetch('/equipos-sin-asignar');
        const equiposAsignados = await resAsignados.json();
        const etiquetasAsignadas = equiposAsignados.map(e => e.etiquetaEquipo);

        // 3. Filtrar equipos NO asignados
        const disponibles = equipos.filter(equipo =>
          !etiquetasAsignadas.includes(equipo.etiquetaEquipo)
        );
        setEquiposDisponibles(disponibles);
      } catch (error) {
        setEquiposDisponibles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipos();
  }, []);

  return (
    <div className="equipos-sin-asignar-overlay">
      <div className="equipos-sin-asignar-popup">
        <div className="equipos-sin-asignar-header">
          <h3>Equipos Disponibles</h3>
          <button className="equipos-sin-asignar-close" onClick={onClose}>×</button>
        </div>
        <div className="equipos-sin-asignar-body">
          {loading ? (
            <div className="equipos-sin-asignar-empty">Cargando...</div>
          ) : equiposDisponibles && equiposDisponibles.length > 0 ? (
            <ul className="equipos-sin-asignar-list">
              {equiposDisponibles.map((equipo) => (
                <li key={equipo.id || equipo.etiquetaEquipo}>
                  <strong>{equipo.etiquetaEquipo}</strong> - {equipo.descripcion || equipo.tipo}
                </li>
              ))}
            </ul>
          ) : (
            <div className="equipos-sin-asignar-empty">No hay equipos disponibles.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquiposSinAsignar;