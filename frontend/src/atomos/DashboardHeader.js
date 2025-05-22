import React from 'react';
import { BsGearFill } from 'react-icons/bs';

const DashboardHeader = () => (
  <header className="mtsk-dashboard__header">
    <div>
      <h1 className="mtsk-dashboard__title">Panel de Control MTSK</h1>
      <p className="mtsk-dashboard__subtitle">Gestión de equipos tecnológicos</p>
    </div>
    <div className="mtsk-dashboard__header-actions">
      <button className="mtsk-btn mtsk-btn--secondary">
        <BsGearFill /> Configuración
      </button>
    </div>
  </header>
);

export default DashboardHeader;