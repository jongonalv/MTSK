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
  FaClipboardList
} from 'react-icons/fa';
import './estilos/inicio.css';

const Inicio = () => {
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMov, setLoadingMov] = useState(true);

  // Cargar equipos y usuarios al montar
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
        setEquipos([]);
        setUsuarios([]);
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
        setMovimientos([]);
      }
      setLoadingMov(false);
    };
    fetchMovimientos();
  }, []);

  // Procesar datos
  const totalEquipos = equipos.length;
  const totalUsuarios = usuarios.length;
  const equiposSinAsignar = equipos.filter(e => e.usuario === 'Sin asignar');
  const ultimosEquipos = [...equipos]
    .sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra))
    .slice(0, 5);

  return (
    <div className="inicio-container">
      <div className="inicio-header">
        <div className="inicio-header-content">
          <h1 className="inicio-title">Panel de Control MTSK</h1>
        </div>
      </div>

      <div className="inicio-metrics-grid">
        <div className="inicio-metric-card">
          <div className="inicio-metric-icon" style={{ backgroundColor: 'rgba(74, 108, 247, 0.1)' }}>
            <FaLaptop style={{ color: '#4a6cf7' }} />
          </div>
          <div className="inicio-metric-info">
            <span className="inicio-metric-title">Total Equipos</span>
            <strong className="inicio-metric-value">{loading ? '...' : totalEquipos}</strong>
          </div>
        </div>
        
        <div className="inicio-metric-card">
          <div className="inicio-metric-icon" style={{ backgroundColor: 'rgba(58, 213, 152, 0.1)' }}>
            <FaUsers style={{ color: '#3ad598' }} />
          </div>
          <div className="inicio-metric-info">
            <span className="inicio-metric-title">Usuarios Registrados</span>
            <strong className="inicio-metric-value">{loading ? '...' : totalUsuarios}</strong>
          </div>
        </div>
        
        <div className="inicio-metric-card">
          <div className="inicio-metric-icon" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
            <FaUserSlash style={{ color: '#ff6b6b' }} />
          </div>
          <div className="inicio-metric-info">
            <span className="inicio-metric-title">Equipos sin Asignar</span>
            <strong className="inicio-metric-value">{loading ? '...' : equiposSinAsignar.length}</strong>
          </div>
        </div>
        
        <div className="inicio-metric-card">
          <div className="inicio-metric-icon" style={{ backgroundColor: 'rgba(253, 181, 63, 0.1)' }}>
            <FaBoxOpen style={{ color: '#fdb53f' }} />
          </div>
          <div className="inicio-metric-info">
            <span className="inicio-metric-title">Disponibles</span>
            <strong className="inicio-metric-value">{loading ? '...' : equipos.filter(e => e.estado === 'Disponible').length}</strong>
          </div>
        </div>
      </div>

      <div className="inicio-content-grid">
        <div className="inicio-widget-card">
          <div className="inicio-widget-header">
            <FaListUl className="inicio-widget-icon" />
            <h3 className="inicio-widget-title">Últimos equipos agregados</h3>
          </div>
          <div className="inicio-widget-body">
            {loading ? (
              <div className="inicio-loading-state">Cargando equipos...</div>
            ) : ultimosEquipos.length === 0 ? (
              <div className="inicio-empty-state">No hay equipos registrados</div>
            ) : (
              <ul className="inicio-data-list">
                {ultimosEquipos.map(eq => (
                  <li key={eq.etiquetaEquipo} className="inicio-data-item">
                    <div className="inicio-item-main">
                      <strong>{eq.etiquetaEquipo}</strong>
                      <span>{eq.marca} {eq.modelo}</span>
                    </div>
                    <div className="inicio-item-meta">{new Date(eq.fechaCompra).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="inicio-widget-footer">
            <a href="#/equipos" className="inicio-view-all">
              Ver todos los equipos <FaArrowRight />
            </a>
          </div>
        </div>

        <div className="inicio-widget-card">
          <div className="inicio-widget-header">
            <FaUserSlash className="inicio-widget-icon" />
            <h3 className="inicio-widget-title">Equipos sin asignar</h3>
          </div>
          <div className="inicio-widget-body">
            {loading ? (
              <div className="inicio-loading-state">Cargando datos...</div>
            ) : equiposSinAsignar.length === 0 ? (
              <div className="inicio-empty-state">Todos los equipos están asignados</div>
            ) : (
              <ul className="inicio-data-list">
                {equiposSinAsignar.slice(0, 5).map(eq => (
                  <li key={eq.etiquetaEquipo} className="inicio-data-item">
                    <div className="inicio-item-main">
                      <strong>{eq.etiquetaEquipo}</strong>
                      <span>{eq.marca} {eq.modelo}</span>
                    </div>
                    <div className="inicio-item-meta">{eq.tipo}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="inicio-widget-footer">
            <a href="#/asignaciones" className="inicio-view-all">
              Gestionar asignaciones <FaArrowRight />
            </a>
          </div>
        </div>

        <div className="inicio-widget-card">
          <div className="inicio-widget-header">
            <FaHistory className="inicio-widget-icon" />
            <h3 className="inicio-widget-title">Actividad reciente</h3>
          </div>
          <div className="inicio-widget-body">
            {loadingMov ? (
              <div className="inicio-loading-state">Cargando movimientos...</div>
            ) : movimientos.length === 0 ? (
              <div className="inicio-empty-state">No hay actividad reciente</div>
            ) : (
              <ul className="inicio-activity-list">
                {movimientos.map(mov => (
                  <li key={mov.ID_Movimiento} className="inicio-activity-item">
                    <div className="inicio-activity-type">{mov.tipoMovimiento}</div>
                    <div className="inicio-activity-details">
                      <p>{mov.Comentario}</p>
                      <time>{new Date(mov.fecha).toLocaleString()}</time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="inicio-widget-footer">
            <a href="#/movimientos" className="inicio-view-all">
              Ver historial completo <FaArrowRight />
            </a>
          </div>
        </div>

        <div className="inicio-widget-card inicio-quick-actions">
          <div className="inicio-widget-header">
            <FaPlusCircle className="inicio-widget-icon" />
            <h3 className="inicio-widget-title">Acciones rápidas</h3>
          </div>
          <div className="inicio-widget-body">
            <ul className="inicio-actions-list">
              <li>
                <a href="#/agregar-equipo" className="inicio-action-link">
                  <div className="inicio-action-icon">
                    <FaLaptop />
                  </div>
                  <span>Agregar nuevo equipo</span>
                </a>
              </li>
              <li>
                <a href="#/registrar-usuario" className="inicio-action-link">
                  <div className="inicio-action-icon">
                    <FaUsers />
                  </div>
                  <span>Registrar nuevo usuario</span>
                </a>
              </li>
              <li>
                <a href="#/asignar-equipo" className="inicio-action-link">
                  <div className="inicio-action-icon">
                    <FaClipboardList />
                  </div>
                  <span>Realizar asignación</span>
                </a>
              </li>
              <li>
                <a href="#/reportes" className="inicio-action-link">
                  <div className="inicio-action-icon">
                    <FaBoxOpen />
                  </div>
                  <span>Generar reporte</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;