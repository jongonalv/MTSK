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

const BarraFilter = ({ searchTerm, setSearchTerm, selectedTipo, setSelectedTipo, selectedDate, setSelectedDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (value) => setSearchTerm(value);
  const handleTipoChange = (value) => setSelectedTipo(value);
  const handleDateChange = (value) => setSelectedDate(value);

  return (
    <div className="barra-filter-container">
      <BarraBusqueda searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <SelectTipo selectedTipo={selectedTipo} onChange={handleTipoChange} />
      <DateFilter selectedDate={selectedDate} handleDateChange={handleDateChange} />
      <BotonAgregar label="Agregar Equipo" onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AgregarEquipoForm />
        </Modal>
      )}
    </div>
  );
};

export default BarraFilter;
