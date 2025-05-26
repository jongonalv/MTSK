import React from 'react';
import './estilos/AgregarEquipoForm.css';
import { FiPlusCircle, FiHardDrive, FiCpu, FiTag, FiShoppingBag, FiCalendar } from 'react-icons/fi';
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
    <div className="aeq-form-container">
      <div className="aeq-form-header">
        <FiPlusCircle className="aeq-header-icon" />
        <h2>Agregar Nuevo Equipo</h2>
      </div>

      <form onSubmit={handleSubmit} className="aeq-form">
        {/* Sección 1: Información del Equipo */}
        <div className="aeq-form-card">
          <div className="aeq-card-header">
            <FiHardDrive className="aeq-card-icon" />
            <h3>Información del Equipo</h3>
          </div>
          
          <div className="aeq-form-grid">
            <div className="aeq-form-group">
              <label>Etiqueta de Equipo</label>
              <div className="aeq-input-with-icon">
                <FiTag />
                <input
                  type="text"
                  name="etiquetaEquipo"
                  value={formData.etiquetaEquipo}
                  readOnly
                  required
                />
              </div>
              {errors.etiquetaEquipo && <span className="aeq-error">{errors.etiquetaEquipo}</span>}
            </div>
            
            <div className="aeq-form-group">
              <label>Tipo de Equipo</label>
              <select 
                name="tipo" 
                value={formData.tipo} 
                onChange={handleChange}
              >
                <option value="PORTATIL">Portátil</option>
                <option value="WORKSTATION">Workstation</option>
                <option value="SOBREMESA">Sobremesa</option>
              </select>
            </div>
            
            <div className="aeq-form-group">
              <label>Marca</label>
              <input 
                type="text" 
                name="marca" 
                value={formData.marca} 
                onChange={handleChange} 
                required 
              />
              {errors.marca && <span className="aeq-error">{errors.marca}</span>}
            </div>
            
            <div className="aeq-form-group">
              <label>Modelo</label>
              <input 
                type="text" 
                name="modelo" 
                value={formData.modelo} 
                onChange={handleChange} 
                required 
              />
              {errors.modelo && <span className="aeq-error">{errors.modelo}</span>}
            </div>
            
            <div className="aeq-form-group aeq-checkbox-container">
              <label className="aeq-checkbox-label">
                <input
                  type="checkbox"
                  name="esBackup"
                  checked={formData.esBackup}
                  onChange={handleChange}
                  className="aeq-checkbox"
                />
                <span className="aeq-checkmark"></span>
                ¿Es Backup?
              </label>
            </div>
          </div>
        </div>

        {/* Sección 2: Especificaciones Técnicas */}
        <div className="aeq-form-card">
          <div className="aeq-card-header">
            <FiCpu className="aeq-card-icon" />
            <h3>Especificaciones Técnicas</h3>
          </div>
          
          <div className="aeq-form-grid">
            <div className="aeq-form-group">
              <label>Procesador</label>
              <input 
                type="text" 
                name="procesador" 
                value={formData.procesador} 
                onChange={handleChange} 
                required 
              />
              {errors.procesador && <span className="aeq-error">{errors.procesador}</span>}
            </div>
            
            <div className="aeq-form-group">
              <label>Memoria RAM</label>
              <select 
                name="ram" 
                value={formData.ram} 
                onChange={handleChange}
              >
                <option value="4GB">4GB</option>
                <option value="8GB">8GB</option>
                <option value="16GB">16GB</option>
                <option value="32GB">32GB</option>
              </select>
            </div>
            
            <div className="aeq-form-group">
              <label>Disco Duro</label>
              <input 
                type="text" 
                name="discoDuro" 
                value={formData.discoDuro} 
                onChange={handleChange} 
                required 
              />
              {errors.discoDuro && <span className="aeq-error">{errors.discoDuro}</span>}
            </div>
            
            <div className="aeq-form-group">
              <label>Sistema Operativo</label>
              <select 
                name="sistemaOperativo" 
                value={formData.sistemaOperativo} 
                onChange={handleChange}
              >
                <option value="Windows 10">Windows 10</option>
                <option value="Windows 11">Windows 11</option>
                <option value="Mac">macOS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección 3: Datos de Identificación */}
        <div className="aeq-form-card">
          <div className="aeq-card-header">
            <FiTag className="aeq-card-icon" />
            <h3>Datos de Identificación</h3>
          </div>
          
          <div className="aeq-form-grid">
            <div className="aeq-form-group">
              <label>Número de Serie</label>
              <input 
                type="text" 
                name="numeroSerie" 
                value={formData.numeroSerie} 
                onChange={handleChange} 
                required 
              />
              {errors.numeroSerie && <span className="aeq-error">{errors.numeroSerie}</span>}
            </div>
            
            <div className="aeq-form-group">
              <label>Número de Pedido</label>
              <input 
                type="text" 
                name="numeroPedido" 
                value={formData.numeroPedido} 
                onChange={handleChange} 
                required 
              />
              {errors.numeroPedido && <span className="aeq-error">{errors.numeroPedido}</span>}
            </div>
          </div>
        </div>

        {/* Sección 4: Información de Compra */}
        <div className="aeq-form-card">
          <div className="aeq-card-header">
            <FiShoppingBag className="aeq-card-icon" />
            <h3>Información de Compra</h3>
          </div>
          
          <div className="aeq-form-grid">
            <div className="aeq-form-group">
              <label>Fecha de Compra</label>
              <div className="aeq-input-with-icon">
                <FiCalendar />
                <input 
                  type="date" 
                  name="fechaCompra" 
                  value={formData.fechaCompra} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              {errors.fechaCompra && <span className="aeq-error">{errors.fechaCompra}</span>}
            </div>
            
            <div className="aeq-form-group">
              <label>Garantía (años)</label>
              <input 
                type="number" 
                name="garantia" 
                value={formData.garantia} 
                onChange={handleChange} 
                min="1"
                required 
              />
              {errors.garantia && <span className="aeq-error">{errors.garantia}</span>}
            </div>
            
            <div className="aeq-form-group">
              <label>Empresa</label>
              <select 
                name="empresa" 
                value={formData.empresa} 
                onChange={handleChange}
              >
                <option value="AG Legazpi">AG Legazpi</option>
                <option value="HT Legazpi">HT Legazpi</option>
                <option value="Rozalma">Rozalma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botón de envío y mensajes */}
        <div className="aeq-form-footer">
          <button type="submit" className="aeq-submit-button">
            <FiPlusCircle /> Agregar Equipo
          </button>
          
          {message && (
            <div className={`aeq-message ${message.includes('éxito') ? 'aeq-success' : 'aeq-error'}`}>
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default React.memo(AgregarEquipoForm);