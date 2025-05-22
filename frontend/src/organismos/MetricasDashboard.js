import React from 'react';
import MetricCard from '../moleculas/componentes_inicio/MetricCard';
import { FaLaptop, FaUsers, FaUserSlash, FaBoxOpen } from 'react-icons/fa';

const MetricasDashboard = ({ stats, loading }) => {
  const totalBackup =
    (stats.tiposEquipos?.Backup || 0) +
    (stats.tiposEquipos?.backup || 0) +
    (stats.tiposEquipos?.BACKUP || 0);

  return (
    <section className="mtsk-metrics-grid">
      <MetricCard 
        icon={<FaLaptop />} 
        title="Total Equipos" 
        value={loading ? '...' : stats.totalEquipos} 
        loading={loading}
        color="primary"
      />
      <MetricCard 
        icon={<FaUsers />} 
        title="Usuarios Registrados" 
        value={loading ? '...' : stats.totalUsuarios} 
        loading={loading}
        color="success"
      />
      <MetricCard 
        icon={<FaUserSlash />} 
        title="Equipos sin Asignar" 
        value={loading ? '...' : stats.equiposSinAsignar} 
        loading={loading}
        color="danger"
      />
      <MetricCard 
        icon={<FaBoxOpen />} 
        title="Equipos Backup" 
        value={loading ? '...' : totalBackup}
        loading={loading}
        color="warning"
      />
    </section>
  );
};

export default MetricasDashboard;
