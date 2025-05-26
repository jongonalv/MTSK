import React from 'react';
import './estilos/equiposStats.css';
import {
  FaDesktop,
  FaLaptop,
  FaServer,
  FaBox,
  FaUserSlash,
  FaWindows,
  FaChartBar,
  FaDatabase
} from 'react-icons/fa';
import useEquiposStats from '../hooks/useEquiposStats';

const EquiposStats = ({ fetchEquipos }) => {
  const { stats, loading } = useEquiposStats(fetchEquipos);

  return (
    <div className="equipos-stats-container">
      <h2>
        <FaChartBar style={{ marginRight: '10px' }} />
        Estadísticas de Equipos
      </h2>

      {loading ? (
        <div className="loading-spinner">Cargando datos...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card total">
            <FaDatabase className="icon" />
            <h3>Total Equipos</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card backup">
            <FaBox className="icon" />
            <h3>Backups</h3>
            <p>{stats.backup}</p>
          </div>
          <div className="stat-card sin-asignar">
            <FaUserSlash className="icon" />
            <h3>Sin Asignar</h3>
            <p>{stats.sinAsignar}</p>
          </div>
          <div className="stat-card portatil">
            <FaLaptop className="icon" />
            <h3>Portátiles</h3>
            <p>{stats.portatiles}</p>
          </div>
          <div className="stat-card workstation">
            <FaServer className="icon" />
            <h3>Workstations</h3>
            <p>{stats.workstations}</p>
          </div>
          <div className="stat-card sobremesa">
            <FaDesktop className="icon" />
            <h3>Sobremesas</h3>
            <p>{stats.sobremesas}</p>
          </div>
          <div className="stat-card win10">
            <FaWindows className="icon" />
            <h3>Windows 10</h3>
            <p>{stats.win10}</p>
          </div>
          <div className="stat-card win11">
            <FaWindows className="icon" />
            <h3>Windows 11</h3>
            <p>{stats.win11}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquiposStats;
