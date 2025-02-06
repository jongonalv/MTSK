import React, { useState } from 'react'; 
import "./selectTipo.css";

const SelectTipo = ({ label, onChange }) => {

    const [selectedTipo, setSelectedTipo] = useState('');

    const handleTipoChange = (e) => {
        setSelectedTipo(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="select-tipo-container">
            {label && <label className="select-label">{label}</label>}  {/* Mostrar la etiqueta si se pasa */}
            <select
                value={selectedTipo}
                onChange={handleTipoChange}
                className="filter-select"
            >
                <option value="">Todos</option>
                <option value="Portátil">Portátil</option>
                <option value="Sobremesa">Sobremesa</option>
                <option value="Backup">Backup</option>
                <option value="Workstation">Workstation</option>
            </select>
        </div>
    );
};

export default SelectTipo;
