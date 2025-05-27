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
const BarraFilter = ({ searchTerm, setSearchTerm, selectedTipo, setSelectedTipo, selectedDate, setSelectedDate, reloadEquipos, fetchEquipos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordenEtiqueta, setOrdenEtiqueta] = useState('desc'); // Nuevo estado para el orden

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

      {/* Filtro de orden de etiquetaEquipo */}
      <div className="barra-filter-item">
        <select value={ordenEtiqueta} onChange={e => setOrdenEtiqueta(e.target.value)}>
          <option value="desc">Etiqueta: Mayor a menor</option>
          <option value="asc">Etiqueta: Menor a mayor</option>
        </select>
      </div>

      <BotonAgregar label="Agregar Equipo" type="submit" onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          fullScreen={true}
        >
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
