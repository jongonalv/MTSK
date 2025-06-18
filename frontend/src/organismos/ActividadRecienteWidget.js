import React, { useState } from 'react';
import { FaHistory } from 'react-icons/fa';
import WidgetCard from '../moleculas/componentes_inicio/WidgetCard';
import { getActivityIcon } from '../helpers/icons';

const FILTROS = [
  "Editar equipo",
  "Asignar usuario",
  "Alta equipo",
  "Eliminar equipo",
  "Alta usuario",
];

const ActividadRecienteWidget = ({ loadingMov, movimientos }) => {
  const [showAll, setShowAll] = useState(false);
  const [filtro, setFiltro] = useState("TODOS");

  const movimientosRecientes = Array.isArray(movimientos)
    ? movimientos
        .slice()
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5)
    : [];

  const movimientosOrdenados = Array.isArray(movimientos)
    ? movimientos
        .slice()
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    : [];

  const movimientosFiltrados = filtro === "TODOS"
    ? movimientosOrdenados
    : movimientosOrdenados.filter(mov => mov.tipoMovimiento === filtro);

  const renderItem = (mov) => (
    <div className="mtsk-activity-item" key={mov.id || mov._id || mov.fecha + mov.tipoMovimiento}>
      <div className={`mtsk-activity-icon ${mov.tipoMovimiento?.toLowerCase()}`}>
        {getActivityIcon(mov.tipoMovimiento)}
      </div>
      <div className="mtsk-activity-content">
        <div className="mtsk-activity-header">
          <strong>{mov.tipoMovimiento}</strong>
          <time>{new Date(mov.fecha).toLocaleString()}</time>
        </div>
        <p className="mtsk-activity-details">{mov.Comentario}</p>
        <div className="mtsk-activity-meta">
          {mov.equipo && <span>Equipo: {mov.equipo}</span>}
          {mov.usuario && <span>Usuario: {mov.usuario}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <WidgetCard 
        icon={<FaHistory />} 
        title="Actividad reciente" 
        loading={loadingMov} 
        data={movimientosRecientes}
        emptyMessage="No hay actividad reciente"
        renderItem={renderItem}
        footerLink="#"
        footerText={
          <span
            className="mtsk-widget-footer-link--small"
            style={{ cursor: 'pointer' }}
            onClick={e => {
              e.preventDefault();
              setShowAll(true);
            }}
          >
            Ver historial completo
          </span>
        }
      />
      {showAll && (
        <div className="mtsk-modal-overlay" onClick={() => setShowAll(false)}>
          <div
            className="mtsk-modal"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: 24,
              borderRadius: 8,
              boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
              position: 'fixed',
              top: '10vh',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1001,
              minWidth: 350,
              width: '90%',
              maxWidth: 600
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <h2 style={{margin: 0}}>Historial completo</h2>
              <button onClick={() => setShowAll(false)} style={{fontSize: 20, background: 'none', border: 'none', cursor: 'pointer'}}>×</button>
            </div>
            <div style={{marginBottom: 16}}>
              <label style={{marginRight: 8}}>Filtrar por tipo:</label>
              <select value={filtro} onChange={e => setFiltro(e.target.value)}>
                <option value="TODOS">Todos</option>
                {FILTROS.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            {movimientosFiltrados.length === 0 ? (
              <div>No hay actividad reciente</div>
            ) : (
              movimientosFiltrados.map(renderItem)
            )}
          </div>
          <style>
            {`
              .mtsk-modal-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.3);
                z-index: 1000;
                display: flex;
                align-items: flex-start;
                justify-content: center;
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default ActividadRecienteWidget;