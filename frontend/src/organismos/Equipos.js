import React, { useState } from 'react';
import EquiposHeader from '../moleculas/EquiposHeader';
import EquiposFilter from '../moleculas/EquiposFilter';
import EquiposTable from '../moleculas/EquiposTable';
import EquiposDetail from './EquiposDetalles';
import RecentEquipos from '../moleculas/RecentEquipos';
import './equipos.css';

const Equipos = ({ equiposData, recentEquipos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [spinAnimationActive, setSpinAnimationActive] = useState(false);

  const handleRowClick = (equipo) => {
    setSelectedEquipo(equipo);
  };

  const filteredEquipos = equiposData.filter((equipo) => {
    const matchesSearchTerm =
      equipo.etiquetaEquipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo ? equipo.tipo.toLowerCase() === selectedTipo.toLowerCase() : true;
    const matchesDate = selectedDate ? new Date(equipo.fechaCompra).toISOString().split('T')[0] === selectedDate : true;

    return matchesSearchTerm && matchesTipo && matchesDate;
  });

  return (
    <div className="equipos-main-container">
      <div className="equipos-content">
        <div className="equipos-container">
          <EquiposHeader />
          <EquiposFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTipo={selectedTipo}
            setSelectedTipo={setSelectedTipo}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <EquiposTable
            filteredEquipos={filteredEquipos}
            handleRowClick={handleRowClick}
          />
        </div>      

        <div className="detalles-container">
          {selectedEquipo ? (
            <EquiposDetail equipo={selectedEquipo} reloadEquipos={() => {}} />
          ) : (
            <div className="no-selection">
              <p>Selecciona un equipo para ver los detalles.</p>
            </div>
          )}
        </div>

        {/* Contenedor para los equipos recientes */}
        <RecentEquipos
          recentEquipos={recentEquipos}
          handleRowClick={handleRowClick}
          spinAnimationActive={spinAnimationActive}
        />
      </div>
    </div>
  );
};

export default Equipos;