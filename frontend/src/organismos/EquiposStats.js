import React, { useEffect, useState } from 'react';
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

const EquiposStats = ({ fetchEquipos }) => {
  const [stats, setStats] = useState({
    total: 0,
    backup: 0,
    sinAsignar: 0,
    portatiles: 0,
    workstations: 0,
    sobremesas: 0,
    win10: 0,
    win11: 0,
  });

  const [loading, setLoading] = useState(true);

  // Función para actualizar las estadísticas de los equipos
  const actualizarEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await fetchEquipos();

      // Filtrar y contar los equipos según las categorías
      const total = data.length;
      const backup = data.filter(e => e.tipo === 'BACKUP').length;
      const sinAsignar = data.filter(e => e.usuario === 'Sin asignar').length;
      const portatiles = data.filter(e => e.tipo === 'PORTATIL').length;
      const workstations = data.filter(e => e.tipo === 'WORKSTATION').length;
      const sobremesas = data.filter(e => e.tipo === 'SOBREMESA').length;
      const win10 = data.filter(e => e.sistemaOperativo?.toLowerCase().includes('windows 10')).length;
      const win11 = data.filter(e => e.sistemaOperativo?.toLowerCase().includes('windows 11')).length;

      // Actualizar el estado con las estadísticas
      setStats({ total, backup, sinAsignar, portatiles, workstations, sobremesas, win10, win11 });
    } catch (error) {
      console.error("Error actualizando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Llamada inicial para cargar las estadísticas
  useEffect(() => {
    actualizarEstadisticas();

    // ESTA BUGEADO, MEJORAR EN EL FUTURO EL PARPADEO QUE GENERA LA ACTUALIZACION DE DATOS
    // Configurar un intervalo para actualizar las estadísticas cada 10 segundos
    const intervalo = setInterval(() => {
      actualizarEstadisticas();
    }, 100000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, []);


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
