import { useState, useEffect } from 'react';

export function useAgregarEquipoForm({ onSubmit, fetchEquipos, reloadEquipos }) {
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

  const getEtiquetaPrefix = (tipo, empresa, esBackup) => {
    let prefix = '';
    if (tipo === 'PORTATIL') prefix = 'P';
    else if (tipo === 'WORKSTATION') prefix = 'W';
    else if (tipo === 'SOBREMESA') prefix = 'S';
    if (esBackup) prefix = prefix[0] + 'B' + prefix.slice(1);
    if (empresa === 'HT Legazpi') prefix += 'HT';
    else if (empresa === 'AG Legazpi' || empresa === 'Rozalma') prefix += 'AG';
    return prefix;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.tipo, formData.empresa, formData.esBackup]);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.etiquetaEquipo) newErrors.etiquetaEquipo  = 'La etiqueta de equipo es requerida';
    if (!formData.marca) newErrors.marca                    = 'La marca es requerida';
    if (!formData.modelo) newErrors.modelo                  = 'El modelo es requerido';
    if (!formData.procesador) newErrors.procesador          = 'El procesador es requerido';
    if (!formData.discoDuro) newErrors.discoDuro            = 'El disco duro es requerido';
    if (!formData.numeroSerie) newErrors.numeroSerie        = 'El número de serie es requerido';
    if (!formData.numeroPedido) newErrors.numeroPedido      = 'El número de pedido es requerido';
    if (!formData.fechaCompra) newErrors.fechaCompra        = 'La fecha de compra es requerida';
    if (!formData.garantia) newErrors.garantia              = 'La garantía es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateForm()) {
      setMessage('Te has marcao un mango, se te ha olvidao algo :)');
      return;
    }
    try {
      const tipoFinal = formData.esBackup ? "BACKUP" : formData.tipo;
      const { esBackup, ...rest } = formData;
      const dataToSend = { ...rest, tipo: tipoFinal };
      const response = await fetch('http://localhost:3001/agregarEquipo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${errorText}`);
      }
      setMessage('Equipo agregado correctamente');
      const delayedActions = [fetchEquipos, reloadEquipos];
      delayedActions.forEach(fn => {
        if (fn) setTimeout(fn, 100);
      });
      if (onSubmit) onSubmit(dataToSend);
    } catch (error) {
      setMessage('Error al agregar el equipo');
    }
  };

  return {
    formData,
    errors,
    message,
    handleChange,
    handleSubmit
  };
}
