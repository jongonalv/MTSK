import React from 'react';
import './estilos/AgregarEquipoForm.css';
import BotonAgregar from '../atomos/agregarButton';
import { useAgregarEquipoForm } from '../hooks/useAgregarEquipoForm';

const AgregarEquipoForm = ({ onSubmit, fetchEquipos, reloadEquipos }) => {
  const {
    formData,
    errors,
    message,
    handleChange,
    handleSubmit
  } = useAgregarEquipoForm({ onSubmit, fetchEquipos, reloadEquipos });

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {/* Sección 1: Información del Equipo */}
      <fieldset className="form-section">
        <legend>Información del Equipo</legend>
        <div className="form-group">
          <label>Etiqueta de Equipo:</label>
          <input
            type="text"
            name="etiquetaEquipo"
            value={formData.etiquetaEquipo}
            readOnly // <-- Solo lectura
            required
          />
          {errors.etiquetaEquipo && <span className="error">{errors.etiquetaEquipo}</span>}
        </div>
        <div className="form-group">
          <label>Tipo:</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="PORTATIL">PORTATIL</option>
            <option value="WORKSTATION">WORKSTATION</option>
            <option value="SOBREMESA">SOBREMESA</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="esBackup"
              checked={formData.esBackup}
              onChange={handleChange}
            />
            ¿Es Backup?
          </label>
        </div>
        <div className="form-group">
          <label>Marca:</label>
          <input type="text" name="marca" value={formData.marca} onChange={handleChange} required />
          {errors.marca && <span className="error">{errors.marca}</span>}
        </div>
        <div className="form-group">
          <label>Modelo:</label>
          <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} required />
          {errors.modelo && <span className="error">{errors.modelo}</span>}
        </div>
      </fieldset>

      {/* Sección 2: Especificaciones Técnicas */}
      <fieldset className="form-section">
        <legend>Especificaciones Técnicas</legend>
        <div className="form-group">
          <label>Procesador:</label>
          <input type="text" name="procesador" value={formData.procesador} onChange={handleChange} required />
          {errors.procesador && <span className="error">{errors.procesador}</span>}
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
          {errors.discoDuro && <span className="error">{errors.discoDuro}</span>}
        </div>
        <div className="form-group">
          <label>Sistema Operativo:</label>
          <select name="sistemaOperativo" value={formData.sistemaOperativo} onChange={handleChange}>
            <option value="Windows 10">Windows 10</option>
            <option value="Windows 11">Windows 11</option>
            <option value="Mac">Mac</option>
          </select>
        </div>
      </fieldset>

      {/* Sección 3: Datos de Identificación */}
      <fieldset className="form-section">
        <legend>Datos de Identificación</legend>
        <div className="form-group">
          <label>Número de Serie:</label>
          <input type="text" name="numeroSerie" value={formData.numeroSerie} onChange={handleChange} required />
          {errors.numeroSerie && <span className="error">{errors.numeroSerie}</span>}
        </div>
        <div className="form-group">
          <label>Número de Pedido:</label>
          <input type="text" name="numeroPedido" value={formData.numeroPedido} onChange={handleChange} required />
          {errors.numeroPedido && <span className="error">{errors.numeroPedido}</span>}
        </div>
      </fieldset>

      {/* Sección 4: Información de Compra y Garantía */}
      <fieldset className="form-section">
        <legend>Información de Compra y Garantía</legend>
        <div className="form-group">
          <label>Fecha de Compra:</label>
          <input type="date" name="fechaCompra" value={formData.fechaCompra} onChange={handleChange} required />
          {errors.fechaCompra && <span className="error">{errors.fechaCompra}</span>}
        </div>
        <div className="form-group">
          <label>Garantía (años):</label>
          <input type="number" name="garantia" value={formData.garantia} onChange={handleChange} required />
          {errors.garantia && <span className="error">{errors.garantia}</span>}
        </div>
        <div className="form-group">
          <label>Empresa:</label>
          <select name="empresa" value={formData.empresa} onChange={handleChange}>
            <option value="AG Legazpi">AG Legazpi</option>
            <option value="HT Legazpi">HT Legazpi</option>
            <option value="Rozalma">Rozalma</option>
          </select>
        </div>
      </fieldset>

      {/* Botón de envío */}
      <BotonAgregar label="Agregar Equipo" onClick={handleSubmit} />

      {/* Mensaje de éxito o error */}
      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default AgregarEquipoForm;