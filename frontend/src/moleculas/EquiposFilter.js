import React from 'react';
import BarraFilter from './BarraFiltros';

const EquiposFilter = ({ searchTerm, setSearchTerm, selectedTipo, setSelectedTipo, selectedDate, setSelectedDate, reloadEquipos, fetchEquipos }) => {
  return (
    <BarraFilter
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedTipo={selectedTipo}
      setSelectedTipo={setSelectedTipo}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      fetchEquipos={fetchEquipos}
      reloadEquipos={reloadEquipos}
    />
  );
};

export default EquiposFilter;