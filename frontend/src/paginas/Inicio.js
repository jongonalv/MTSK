import React, { useEffect } from 'react';
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

  // refrescar la página cada 5 minutos
  useEffect(() => {
    const Interval = setInterval(() => {
      window.location.reload();
    }, 300000); // 5 minutos
    return () => clearInterval(Interval);
  }, []);

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