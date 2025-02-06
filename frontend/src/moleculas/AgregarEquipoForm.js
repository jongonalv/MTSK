import React, { useState } from 'react';

const AgregarEquipoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    etiquetaEquipo: '',
    tipo: 'PORTATIL',
    procesador: '',
    ram: '8GB',
    discoDuro: '',
    numeroSerie: '',
    numeroPedido: '',
    fechaCompra: '',
    garantia: '',
    empresa: 'AG Legazpi',
    marca: '',
    modelo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Etiqueta de Equipo:</label>
        <input type="text" name="etiquetaEquipo" value={formData.etiquetaEquipo} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Tipo:</label>
        <select name="tipo" value={formData.tipo} onChange={handleChange}>
          <option value="PORTATIL">PORTATIL</option>
          <option value="WORKSTATION">WORKSTATION</option>
          <option value="SOBREMESA">SOBREMESA</option>
          <option value="BACKUP">BACKUP</option>
        </select>
      </div>
      <div className="form-group">
        <label>Procesador:</label>
        <input type="text" name="procesador" value={formData.procesador} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>RAM:</label>
        <select name="ram" value={formData.ram} onChange={handleChange}>
          <option value="4GB">4GB</option>
          <option value="8GB">8GB</option>
          <option value="16GB">16GB</option>
          <option value="32GB">32GB</option>
        </select>
      </div>
      <div className="form-group">
        <label>Disco Duro:</label>
        <input type="text" name="discoDuro" value={formData.discoDuro} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Número de Serie:</label>
        <input type="text" name="numeroSerie" value={formData.numeroSerie} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Número de Pedido:</label>
        <input type="text" name="numeroPedido" value={formData.numeroPedido} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Fecha de Compra:</label>
        <input type="date" name="fechaCompra" value={formData.fechaCompra} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Garantía (años):</label>
        <input type="number" name="garantia" value={formData.garantia} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Empresa:</label>
        <select name="empresa" value={formData.empresa} onChange={handleChange}>
          <option value="AG Legazpi">AG Legazpi</option>
          <option value="HT Legazpi">HT Legazpi</option>
          <option value="Rozalma">Rozalma</option>
        </select>
      </div>
      <div className="form-group">
        <label>Marca:</label>
        <input type="text" name="marca" value={formData.marca} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Modelo:</label>
        <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} required />
      </div>
      <button type="submit">Agregar Equipo</button>
    </form>
  );
};

export default AgregarEquipoForm;