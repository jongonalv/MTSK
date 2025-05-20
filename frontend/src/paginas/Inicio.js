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
  FaMicrochip,
  FaMemory,
  FaHdd
} from 'react-icons/fa';
import { BsGearFill } from 'react-icons/bs';
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
    <div className="dashboard">
      {/* Encabezado */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Panel de Control MTSK</h1>
          <p className="dashboard-subtitle">Gestión de equipos tecnológicos</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="btn btn-secondary">
            <BsGearFill /> Configuración
          </button>
        </div>
      </header>

      {/* Métricas principales */}
      <section className="metrics-grid">
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
          title="Disponibles" 
          value={loading ? '...' : stats.equiposDisponibles} 
          loading={loading}
          color="warning"
        />
      </section>

      {/* Contenido principal */}
      <section className="content-grid">
        <WidgetCard 
          icon={<FaListUl />} 
          title="Últimos equipos agregados" 
          loading={loading} 
          data={ultimosEquipos} 
          emptyMessage="No hay equipos registrados"
          renderItem={(eq) => (
            <div className="widget-item">
              <div className="widget-item-icon">
                <FaLaptop />
              </div>
              <div className="widget-item-content">
                <strong>{eq.etiquetaEquipo}</strong>
                <span>{eq.tipo} • {eq.procesador}</span>
                <div className="widget-item-meta">
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
          <div className="chart-container">
            {stats.tiposEquipos && Object.entries(stats.tiposEquipos).map(([tipo, count]) => (
              <div key={tipo} className="chart-item">
                <div className="chart-label">
                  <span>{tipo}</span>
                  <span>{count} ({Math.round((count / stats.totalEquipos) * 100)}%)</span>
                </div>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar" 
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
            <div className="activity-item">
              <div className={`activity-icon ${mov.tipoMovimiento.toLowerCase()}`}>
                {getActivityIcon(mov.tipoMovimiento)}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <strong>{mov.tipoMovimiento}</strong>
                  <time>{new Date(mov.fecha).toLocaleString()}</time>
                </div>
                <p className="activity-details">{mov.Comentario}</p>
                <div className="activity-meta">
                  {mov.equipo && <span>Equipo: {mov.equipo}</span>}
                  {mov.usuario && <span>Usuario: {mov.usuario}</span>}
                </div>
              </div>
            </div>
          )}
          footerLink="#/movimientos"
          footerText="Ver historial completo"
        />
        
        <QuickActions />
      </section>
    </div>
  );
};

// Helper para obtener icono de actividad
const getActivityIcon = (tipo) => {
  switch(tipo) {
    case 'Asignación': return <FaClipboardList />;
    case 'Mantenimiento': return <FaClipboardList />;
    case 'Reubicación': return <FaClipboardList />;
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

// Componente para tarjetas de métricas
const MetricCard = ({ icon, title, value, loading, color }) => (
  <div className={`metric-card ${color}`}>
    <div className="metric-icon">{icon}</div>
    <div className="metric-content">
      <h3 className="metric-title">{title}</h3>
      <div className="metric-value">
        {loading ? <div className="loading-bar"></div> : value}
      </div>
    </div>
  </div>
);

// Componente para tarjetas de widgets
const WidgetCard = ({ icon, title, loading, data, emptyMessage, renderItem, footerLink, footerText, isChart, isSpecs, children }) => (
  <div className={`widget-card ${isChart ? 'chart-widget' : ''} ${isSpecs ? 'specs-widget' : ''}`}>
    <div className="widget-header">
      <div className="widget-icon">{icon}</div>
      <h3 className="widget-title">{title}</h3>
    </div>
    <div className="widget-body">
      {loading ? (
        <div className="loading-state">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
      ) : isChart || isSpecs ? (
        children
      ) : (!data || data.length === 0) ? (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="widget-list">
          {data.map((item, index) => (
            <div key={index} className="widget-list-item">
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
    {footerLink && (
      <div className="widget-footer">
        <a href={footerLink} className="widget-footer-link">
          {footerText} <FaArrowRight />
        </a>
      </div>
    )}
  </div>
);

// Componente para especificaciones técnicas
const SpecCard = ({ icon, title, data, emptyMessage }) => (
  <div className="spec-card">
    <div className="spec-header">
      <div className="spec-icon">{icon}</div>
      <h4>{title}</h4>
    </div>
    <div className="spec-content">
      {!data || Object.keys(data).length === 0 ? (
        <p className="empty-spec">{emptyMessage}</p>
      ) : (
        <ul className="spec-list">
          {Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([spec, count]) => (
              <li key={spec}>
                <span className="spec-name">{spec}</span>
                <span className="spec-count">{count}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  </div>
);

// Componente para acciones rápidas
const QuickActions = () => (
  <div className="widget-card quick-actions">
    <div className="widget-header">
      <div className="widget-icon">
        <FaPlusCircle />
      </div>
      <h3 className="widget-title">Acciones rápidas</h3>
    </div>
    <div className="widget-body">
      <div className="actions-grid">
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

// Componente para una acción rápida
const QuickAction = ({ link, icon, text, color }) => (
  <a href={link} className={`action-item ${color}`}>
    <div className="action-icon">{icon}</div>
    <span className="action-text">{text}</span>
  </a>
);

export default Inicio;