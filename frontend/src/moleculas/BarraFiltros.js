import React, { useState } from 'react';
import BarraBusqueda from '../atomos/barraBusqueda';
import SelectTipo from '../atomos/selectTipo';
import DateFilter from '../atomos/DateFilter';
import BotonAgregar from '../atomos/agregarButton';
import Modal from './Modal';
import AgregarEquipoForm from './AgregarEquipoForm';
import './estilos/barraFilter.css';
import './estilos/Modal.css';
import './estilos/AgregarEquipoForm.css';

// Componente BarraFilter que contiene los filtros y el botón para agregar un nuevo equipo
const BarraFilter = ({ searchTerm, setSearchTerm, selectedTipo, setSelectedTipo, selectedDate, setSelectedDate, fetchEquipos, reloadEquipos}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funciones para manejar los cambios en los filtros
  const handleSearchChange = (value) => setSearchTerm(value);
  const handleTipoChange = (value) => setSelectedTipo(value);
  const handleDateChange = (value) => setSelectedDate(value);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="barra-filter-container">
      <BarraBusqueda searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <SelectTipo value={selectedTipo} onChange={handleTipoChange} />
      <DateFilter selectedDate={selectedDate} handleDateChange={handleDateChange} />
      <BotonAgregar label="Agregar Equipo" type="submit" onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AgregarEquipoForm 
            onSubmit={handleCloseModal} 
            fetchEquipos={fetchEquipos}
            reloadEquipos={reloadEquipos}
          />
        </Modal>
      )}
    </div>
  );
};

export default BarraFilter;
