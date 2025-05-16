import React, { useState, useEffect } from 'react';
import './estilos/AgregarEquipoForm.css';
import BotonAgregar from '../atomos/agregarButton'; // Importar el componente

const AgregarEquipoForm = ({ onSubmit }) => {

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    etiquetaEquipo: '',
    tipo: 'PORTATIL',
    esBackup: false,
    marca: '',
    modelo: '',
    procesador: '',
    ram: '8GB',
    discoDuro: '',
    numeroSerie: '',
    numeroPedido: '',
    fechaCompra: '',
    garantia: '',
    empresa: 'AG Legazpi',
    sistemaOperativo: 'Windows 10',
  });

  // constante para generar la etiqueta del equipo en base al tipo y empresa
  const getEtiquetaPrefix = (tipo, empresa, esBackup) => {
    let prefix = '';
    if (tipo === 'PORTATIL') prefix = 'P';
    else if (tipo === 'WORKSTATION') prefix = 'W';
    else if (tipo === 'SOBREMESA') prefix = 'S';

    // Si es Backup, añade la B después del prefijo
    if (esBackup) prefix = prefix[0] + 'B' + prefix.slice(1);

    if (empresa === 'HT Legazpi') prefix += 'HT';
    else if (empresa === 'AG Legazpi' || empresa === 'Rozalma') prefix += 'AG';

    return prefix;
  };

  // Hook para generar la etiqueta del equipo al cargar el componente
  useEffect(() => {
    const generarEtiqueta = async () => {
      const prefix = getEtiquetaPrefix(formData.tipo, formData.empresa, formData.esBackup);
      if (!prefix) return;
      try {
        const res = await fetch(`http://localhost:3001/siguienteEtiqueta?prefijo=${prefix}`);
        const data = await res.json();
        setFormData(f => ({ ...f, etiquetaEquipo: `${prefix}${data.siguienteNumero}` }));
      } catch (err) {
        setFormData(f => ({ ...f, etiquetaEquipo: '' }));
      }
    };
    generarEtiqueta();
  }, [formData.tipo, formData.empresa, formData.esBackup]);


  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Función para manejar los cambios en los campos del formulario
  // Actualiza el estado del formulario y limpia los errores si existen
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validar el formulario, comprueba que los campos requeridos no estén vacíos
  const validateForm = () => {
    const newErrors = {};
    if (!formData.etiquetaEquipo) newErrors.etiquetaEquipo = 'La etiqueta de equipo es requerida';
    if (!formData.marca) newErrors.marca = 'La marca es requerida';
    if (!formData.modelo) newErrors.modelo = 'El modelo es requerido';
    if (!formData.procesador) newErrors.procesador = 'El procesador es requerido';
    if (!formData.discoDuro) newErrors.discoDuro = 'El disco duro es requerido';
    if (!formData.numeroSerie) newErrors.numeroSerie = 'El número de serie es requerido';
    if (!formData.numeroPedido) newErrors.numeroPedido = 'El número de pedido es requerido';
    if (!formData.fechaCompra) newErrors.fechaCompra = 'La fecha de compra es requerida';
    if (!formData.garantia) newErrors.garantia = 'La garantía es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para enviar el formulario
  // Se ejecuta al hacer click en el botón de agregar
  // Envia los datos del formulario al servidor y el equipo se agrega al inventario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const tipoFinal = formData.esBackup ? "BACKUP" : formData.tipo;
        const dataToSend = { ...formData, tipo: tipoFinal };
        delete dataToSend.esBackup;
        const response = await fetch('http://localhost:3001/agregarEquipo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend), // <-- Usa dataToSend
        });

        if (!response.ok) {
          throw new Error('Error al agregar el equipo');
        }
        setMessage('Equipo agregado correctamente');
        onSubmit(dataToSend);
      } catch (error) {
        console.error(error);
        setMessage('Error al agregar el equipo');
      }
    } else {
      setMessage('Te has marcao un mango, se te ha bo');
    }
  };

  // Renderizar el formulario
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