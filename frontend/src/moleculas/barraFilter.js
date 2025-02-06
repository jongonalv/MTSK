import React, { useState } from 'react';
import BarraBusqueda from '../atomos/barraBusqueda';
import SelectTipo from '../atomos/selectTipo';
import DateFilter from '../atomos/DateFilter';
import BotonAgregar from '../atomos/agregarButton';
import Modal from './Modal';
import AgregarEquipoForm from './AgregarEquipoForm';
import './barraFilter.css';

const BarraFilter = ({ searchTerm, setSearchTerm, selectedTipo, setSelectedTipo, selectedDate, setSelectedDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleTipoChange = (value) => {
    setSelectedTipo(value);
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  const handleAgregarEquipo = (formData) => {
    // Aquí puedes agregar la lógica para enviar los datos a la base de datos
    console.log('Nuevo equipo agregado:', formData);
    setIsModalOpen(false);
  };

  return (
    <div className="barra-filter-container">
      <div className="barra-filter-item">
        <BarraBusqueda
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
        />
      </div>
      <div className="barra-filter-item">
        <SelectTipo
          selectedTipo={selectedTipo}
          onChange={handleTipoChange}
        />
      </div>
      <div className="barra-filter-item">
        <DateFilter
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
        />
      </div>
      <div className="barra-filter-item">
        <BotonAgregar className="boton-agregar" label="METE" onClick={() => setIsModalOpen(true)} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AgregarEquipoForm onSubmit={handleAgregarEquipo} />
      </Modal>
    </div>
  );
};

export default BarraFilter;