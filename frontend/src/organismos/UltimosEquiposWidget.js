import React from 'react';
import { FaLaptop, FaListUl } from 'react-icons/fa';
import WidgetCard from '../moleculas/componentes_inicio/WidgetCard';

const UltimosEquiposWidget = ({ loading, ultimosEquipos }) => (
  <WidgetCard 
    icon={<FaListUl />} 
    title="Últimos equipos agregados" 
    loading={loading} 
    data={ultimosEquipos} 
    emptyMessage="No hay equipos registrados"
    renderItem={(eq) => (
      <div className="mtsk-widget-item">
        <div className="mtsk-widget-item__icon">
          <FaLaptop />
        </div>
        <div className="mtsk-widget-item__content">
          <strong>{eq.etiquetaEquipo}</strong>
          <span>{eq.tipo} • {eq.procesador}</span>
          <div className="mtsk-widget-item__meta">
            <span>{eq.memoriaRAM} RAM • {eq.discoDuro}</span>
            <span>{new Date(eq.fechaCompra).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    )}
    footerLink="#/equipos"
    footerText="Ver todos los equipos"
  />
);

export default UltimosEquiposWidget;