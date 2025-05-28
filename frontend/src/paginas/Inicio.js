import React from 'react';
import MetricasDashboard from '../organismos/MetricasDashboard';
import QuickActions from '../organismos/QuickActions';
import { useInicioData } from '../hooks/useInicioData';
import DashboardHeader from '../atomos/DashboardHeader';
import UltimosEquiposWidget from '../organismos/UltimosEquiposWidget';
import DistribucionPorTipoWidget from '../organismos/DistribucionPorTipo';
import ActividadRecienteWidget from '../organismos/ActividadRecienteWidget';
import AlertasWidget from '../organismos/AlertasWidget';
import './estilos/inicio.css';

const Inicio = () => {
  const {
    equipos,
    usuarios,
    movimientos,
    stats,
    loading,
    loadingMov,
    ultimosEquipos,
    equiposSinAsignarList
  } = useInicioData();

  return (
    <div className="mtsk-dashboard">
      <DashboardHeader />
      <MetricasDashboard stats={stats} loading={loading} />
      <section className="mtsk-content-grid">
        <DistribucionPorTipoWidget loading={loading} stats={stats} />
        <UltimosEquiposWidget loading={loading} ultimosEquipos={ultimosEquipos} />
        <ActividadRecienteWidget loadingMov={loadingMov} movimientos={movimientos} />
        <QuickActions />
        <AlertasWidget/>
      </section>
    </div>
  );
};

export default Inicio;