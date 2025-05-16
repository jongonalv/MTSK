import React from 'react';
import "./estilos/selectTipo.css";

const SelectTipo = ({ label, value, onChange }) => {
    const handleTipoChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="select-tipo-container">
            {label && <label className="select-label">{label}</label>}
            <select
                value={value}
                onChange={handleTipoChange}
                className="filter-select"
            >
                <option value="">Todos</option>
                <option value="Portatil">Portátil</option>
                <option value="Sobremesa">Sobremesa</option>
                <option value="Backup">Backup</option>
                <option value="Workstation">Workstation</option>
            </select>
        </div>
    );
};

export default SelectTipo;