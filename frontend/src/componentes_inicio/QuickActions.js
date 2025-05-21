import React from 'react';
import { FaPlusCircle, FaLaptop, FaUsers, FaClipboardList, FaBoxOpen } from 'react-icons/fa';
import QuickAction from './QuickAction';

const QuickActions = () => (
  <div className="mtsk-widget-card mtsk-quick-actions">
    <div className="mtsk-widget-card__header">
      <div className="mtsk-widget-card__icon">
        <FaPlusCircle />
      </div>
      <h3 className="mtsk-widget-card__title">Acciones rápidas</h3>
    </div>
    <div className="mtsk-widget-card__body">
      <div className="mtsk-actions-grid">
        <QuickAction 
          link="#/agregar-equipo" 
          icon={<FaLaptop />} 
          text="Agregar equipo" 
          color="primary"
        />
        <QuickAction 
          link="#/registrar-usuario" 
          icon={<FaUsers />} 
          text="Registrar usuario" 
          color="success"
        />
        <QuickAction 
          link="#/asignar-equipo" 
          icon={<FaClipboardList />} 
          text="Asignar equipo" 
          color="warning"
        />
        <QuickAction 
          link="#/reportes" 
          icon={<FaBoxOpen />} 
          text="Generar reporte" 
          color="info"
        />
      </div>
    </div>
  </div>
);

export default QuickActions;
