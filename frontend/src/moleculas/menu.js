import React, { useCallback, useState, useEffect } from 'react';
import './estilos/menu.css';
import Equipos from '../paginas/Equipos';
import Inicio from '../paginas/Inicio';
import Accesorios from '../paginas/Accesorios';
import logo from '../resources/logolargo.png';

const Menu = () => {

  // Estados
  const [selectedComponent, setSelectedComponent] = useState('inicio');
  const [equiposData, setEquiposData] = useState([]);
  const [recentEquipos, setRecentEquipos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // Nuevo estado para el menú responsive

  // Función para cambiar el componente seleccionado
  const handleMenuClick = (component) => {
    setSelectedComponent(component);
    setMenuOpen(false); // Oculta el menú después de seleccionar
  };

  // Función para obtener los equipos
  const fetchEquipos = useCallback(() => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/equipos`)
      .then((response) => response.json())
      .then((data) => {
        setEquiposData(data);

        const sortedEquipos = data.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));
        setRecentEquipos(sortedEquipos.slice(0, 8));
        return data; // 👈 importante: para que el componente `EquiposStats` pueda usar los datos
      })
      .catch((error) => {
        console.error('Error al cargar los datos: ', error);
        return []; // En caso de error, devolvemos array vacío
      });
  }, []);

  // Llamada inicial
  useEffect(() => {
    fetchEquipos();
  }, []);

  return (
    <div>
      {/* Botón hamburguesa para responsive */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Abrir/cerrar menú"
      >
        {/* Icono hamburguesa simple */}
        <span className="menu-toggle-bar"></span>
        <span className="menu-toggle-bar"></span>
        <span className="menu-toggle-bar"></span>
      </button>

      {/* Menú de navegación */}
      <nav className={`menu-container${menuOpen ? ' open' : ''}`}>
        {/* Logo arriba a la izquierda */}
        <img src={logo} alt="Logo" className="menu-logo" />

        <ul className="menu-list">
          <li className="menu-item" onClick={() => handleMenuClick('inicio')}>Inicio</li>
          <li className="menu-item" onClick={() => handleMenuClick('equipos')}>Equipos</li>
          <li className="menu-item" onClick={() => handleMenuClick('accesorios')}>Accesorios</li>
          <li className="menu-item" onClick={() => handleMenuClick('impresoras')}>Impresoras</li>
          <li className="menu-item" onClick={() => handleMenuClick('monitores')}>Monitores</li>
          <li className="menu-item" onClick={() => handleMenuClick('proyectores')}>Proyectores</li>
        </ul>
      </nav>

      {/* Renderizado de los componentes basados en el estado */}
      {selectedComponent === 'equipos' && <Equipos equiposData={equiposData} recentEquipos={recentEquipos} fetchEquipos={fetchEquipos} />}
      {selectedComponent === 'inicio' && <h1><Inicio/></h1>}
      {selectedComponent === 'accesorios' && <h1><Accesorios/></h1>}
      {selectedComponent === 'impresoras' && <h1>Impresoras</h1>}
      {selectedComponent === 'monitores' && <h1>Monitores</h1>}
      {selectedComponent === 'proyectores' && <h1>Proyectores</h1>}
    </div>
  );
};

export default Menu;