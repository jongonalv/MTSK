import React, { useState } from 'react';
import EquiposInfo from '../organismos/EquiposInfo';
import './estilos/equipos.css';

const Equipos = ({ equiposData, recentEquipos, fetchEquipos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [spinAnimationActive, setSpinAnimationActive] = useState(false);

  console.debug('Equipos:', searchTerm);

  const handleRowClick = (equipo) => {
    setSelectedEquipo(equipo);
  };

  const filteredEquipos = equiposData.filter((equipo) => {
    const term = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';
    const matchesSearchTerm =
      equipo.etiquetaEquipo.toLowerCase().includes(term) ||
      equipo.marca.toLowerCase().includes(term) ||
      equipo.modelo.toLowerCase().includes(term);
    const matchesTipo = selectedTipo ? equipo.tipo.toLowerCase() === selectedTipo.toLowerCase() : true;
    const matchesDate = selectedDate ? new Date(equipo.fechaCompra).toISOString().split('T')[0] === selectedDate : true;
  
    return matchesSearchTerm && matchesTipo && matchesDate;
  });

  return (
    <div className="equipos-main-container">
      <EquiposInfo
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTipo={selectedTipo}
        setSelectedTipo={setSelectedTipo}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        filteredEquipos={filteredEquipos}
        handleRowClick={handleRowClick}
        selectedEquipo={selectedEquipo}
        recentEquipos={recentEquipos}
        spinAnimationActive={spinAnimationActive}
        fetchEquipos={fetchEquipos}
      />
    </div>
  );
};

export default Equipos;