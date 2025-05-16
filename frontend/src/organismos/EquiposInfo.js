import React, { useState, useEffect } from 'react';
import EquiposHeader from '../atomos/EquiposHeader';
import EquiposFilter from '../moleculas/EquiposFilter';
import EquiposTable from '../moleculas/EquiposTable';
import EquiposDetail from './EquiposDetalles';
import RecentEquipos from './RecentEquipos';
import EquiposStats from './EquiposStats';
import './estilos/equipos.css';

// Organismo que contiene la información de los equipos
const EquiposInfo = ({
  searchTerm,
  setSearchTerm,
  selectedTipo,
  setSelectedTipo,
  selectedDate,
  setSelectedDate,
  filteredEquipos,
  handleRowClick,
  selectedEquipo,
  recentEquipos,
  spinAnimationActive,
  fetchEquipos,
}) => {
  const [equipos, setEquipos] = useState(filteredEquipos);

  useEffect(() => {
    setEquipos(filteredEquipos);
  }, [filteredEquipos]);

  const reloadEquipos = async () => {
    await fetchEquipos();
    const updatedEquipo = equipos.find(e => e.etiquetaEquipo === selectedEquipo.etiquetaEquipo);
    handleRowClick(updatedEquipo);
  };

  return (
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
          filteredEquipos={equipos}
          handleRowClick={handleRowClick}
        />
      </div>

      <div className="detalles-container">
        {selectedEquipo ? (
          <EquiposDetail equipo={selectedEquipo} reloadEquipos={reloadEquipos} />
        ) : (
          <div className="no-selection">
            <p>Selecciona un equipo para ver los detalles.</p>
          </div>
        )}
      </div>

      <div className="recent-and-stats-container">
        <RecentEquipos
          recentEquipos={recentEquipos}
          handleRowClick={handleRowClick}
          spinAnimationActive={spinAnimationActive}
        />
        <EquiposStats />
      </div>
    </div>
  );
};

export default EquiposInfo;