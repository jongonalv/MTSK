import React from 'react';
import EquiposHeader from '../atomos/EquiposHeader';
import EquiposFilter from '../moleculas/EquiposFilter';
import EquiposTable from '../moleculas/EquiposTable';
import EquiposDetail from './EquiposDetalles';
import RecentEquipos from './RecentEquipos';
import EquiposStats from './EquiposStats';

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
  // Recarga todos los equipos y actualiza la selección tras la recarga
  const reloadEquipos = async () => {
    await fetchEquipos();
    setTimeout(() => {
      if (selectedEquipo) {
        const updatedEquipo = filteredEquipos.find(
          (e) => e.etiquetaEquipo === selectedEquipo.etiquetaEquipo
        );
        if (updatedEquipo) handleRowClick(updatedEquipo);
      }
    }, 300);
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
          fetchEquipos={fetchEquipos}
          reloadEquipos={reloadEquipos}
        />
        <EquiposTable
          filteredEquipos={filteredEquipos}
          handleRowClick={handleRowClick}
        />
      </div>

      <div className="detalles-container">
        {selectedEquipo ? (
          <EquiposDetail equipo={selectedEquipo} reloadEquipos={reloadEquipos} fetchEquipos={fetchEquipos} />
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
        <EquiposStats 
        fetchEquipos={fetchEquipos}
        />
      </div>
    </div>
  );
};

export default EquiposInfo;