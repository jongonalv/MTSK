import React, { useEffect, useState } from 'react';
import { 
  FaLaptop, 
  FaUserSlash, 
  FaUsers, 
  FaPlusCircle, 
  FaListUl, 
  FaHistory,
  FaArrowRight,
  FaBoxOpen,
  FaClipboardList,
  FaChartPie,
  FaTrashAlt // <-- Añadido para icono de eliminar
} from 'react-icons/fa';
import { BsGearFill } from 'react-icons/bs';
import MetricCard from '../componentes_inicio/MetricCard';
import WidgetCard from '../componentes_inicio/WidgetCard';
import QuickActions from '../componentes_inicio/QuickActions';
import './estilos/inicio.css';

const Inicio = () => {
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMov, setLoadingMov] = useState(true);

  // Cargar datos al montar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [equiposRes, usuariosRes] = await Promise.all([
          fetch('http://localhost:3001/equipos'),
          fetch('http://localhost:3001/usuarios')
        ]);
        
        const equiposData = await equiposRes.json();
        const usuariosData = await usuariosRes.json();
        
        setEquipos(equiposData);
        setUsuarios(usuariosData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Cargar movimientos al montar
  useEffect(() => {
    const fetchMovimientos = async () => {
      setLoadingMov(true);
      try {
        const res = await fetch('http://localhost:3001/movimientos?_limit=5&_sort=fecha&_order=desc');
        const data = await res.json();
        setMovimientos(data);
      } catch (err) {
        console.error("Error fetching movements:", err);
      }
      setLoadingMov(false);
    };
    fetchMovimientos();
  }, []);

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    if (loading) return {};
    
    const totalEquipos = equipos.length;
    const equiposSinAsignar = equipos.filter(e => e.usuario === 'Sin asignar').length;
    const equiposDisponibles = equipos.filter(e => e.estado === 'Disponible').length;
    
    // Distribución por tipo de equipo
    const tiposEquipos = equipos.reduce((acc, equipo) => {
      acc[equipo.tipo] = (acc[equipo.tipo] || 0) + 1;
      return acc;
    }, {});
    
    // Distribución de procesadores
    const procesadores = equipos.reduce((acc, equipo) => {
      if (equipo.procesador) {
        acc[equipo.procesador] = (acc[equipo.procesador] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Distribución de memoria RAM
    const memoriaRAM = equipos.reduce((acc, equipo) => {
      if (equipo.memoriaRAM) {
        acc[equipo.memoriaRAM] = (acc[equipo.memoriaRAM] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Distribución de discos duros
    const discosDuros = equipos.reduce((acc, equipo) => {
      if (equipo.discoDuro) {
        acc[equipo.discoDuro] = (acc[equipo.discoDuro] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      totalEquipos,
      equiposSinAsignar,
      equiposDisponibles,
      tiposEquipos,
      procesadores,
      memoriaRAM,
      discosDuros,
      totalUsuarios: usuarios.length
    };
  };

  const stats = calcularEstadisticas();
  const ultimosEquipos = [...equipos]
    .sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra))
    .slice(0, 5);

  const equiposSinAsignarList = [...equipos]
    .filter(e => e.usuario === 'Sin asignar')
    .slice(0, 5);

  return (
    <div className="mtsk-dashboard">
      {/* Encabezado */}
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

      {/* Métricas principales */}
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
          value={
            loading
              ? '...'
              : (
                  (stats.tiposEquipos?.Backup || 0) +
                  (stats.tiposEquipos?.backup || 0) +
                  (stats.tiposEquipos?.BACKUP || 0)
                )
          }
          loading={loading}
          color="warning"
        />
      </section>

      {/* Contenido principal */}
      <section className="mtsk-content-grid">
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

        <WidgetCard 
          icon={<FaChartPie />} 
          title="Distribución por tipo" 
          loading={loading} 
          isChart={true}
        >
          <div className="mtsk-chart-container">
            {stats.tiposEquipos && Object.entries(stats.tiposEquipos).map(([tipo, count]) => (
              <div key={tipo} className="mtsk-chart-item">
                <div className="mtsk-chart-label">
                  <span>{tipo}</span>
                  <span>{count} ({Math.round((count / stats.totalEquipos) * 100)}%)</span>
                </div>
                <div className="mtsk-chart-bar-container">
                  <div 
                    className="mtsk-chart-bar" 
                    style={{
                      width: `${(count / stats.totalEquipos) * 100}%`,
                      backgroundColor: getColorForType(tipo)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        <WidgetCard 
          icon={<FaHistory />} 
          title="Actividad reciente" 
          loading={loadingMov} 
          data={movimientos} 
          emptyMessage="No hay actividad reciente"
          renderItem={(mov) => (
            <div className="mtsk-activity-item">
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
          )}
          footerLink="#/movimientos"
          footerText={<span className="mtsk-widget-footer-link--small">Ver historial completo</span>}
        />

        <QuickActions />
      </section>
    </div>
  );
};

// Helper para obtener icono de actividad
const getActivityIcon = (tipo) => {
  if (!tipo) return <FaClipboardList />;
  const t = tipo.trim().toLowerCase();
  switch(t) {
    case 'editar equipo': return <FaClipboardList />;
    case 'alta equipo': return <FaPlusCircle />;
    case 'asignar usuario': return <FaUsers />;
    case 'eliminar equipo': return <FaTrashAlt />; // Cambiado a un icono más guay
    // Añade variantes si llegan con "de" en medio
    case 'alta de equipo': return <FaPlusCircle />;
    case 'asignar usuario': return <FaUsers />;
    case 'eliminar equipo': return <FaTrashAlt />; // Cambiado aquí también
    default: return <FaClipboardList />;
  }
};
// Helper para obtener color por tipo de equipo
const getColorForType = (tipo) => {
  const colors = {
    'Laptop': '#4361ee',
    'Desktop': '#3f37c9',
    'Servidor': '#4cc9f0',
    'Tablet': '#f72585',
    'Impresora': '#f8961e',
    'Monitor': '#4895ef'
  };
  return colors[tipo] || '#6c757d';
};

export default Inicio;