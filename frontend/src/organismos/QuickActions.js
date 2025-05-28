import React, { useState } from 'react';
import { FaPlusCircle, FaLaptop, FaUsers, FaClipboardList, FaBoxOpen, FaCheckCircle } from 'react-icons/fa';
import QuickAction from '../moleculas/componentes_inicio/QuickAction';
import AgregarEquipoForm from '../moleculas/AgregarEquipoForm';
import EquiposSinAsignar from '../moleculas/EquiposSinAsignar';
import Modal from '../moleculas/Modal';
import './estilos/QuickActions.css';  // Asegúrate de tener este archivo CSS para estilos

const QuickActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [showEquipoModal, setShowEquipoModal] = useState(false);
  const [showEquiposDisponibles, setShowEquiposDisponibles] = useState(false);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [hideMessage, setHideMessage] = useState(false);

  const handleGenerarReporte = async () => {
    const res = await fetch('/reporte-equipos', { method: 'GET' });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_equipos.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Maneja el guardado del nuevo usuario
  // y valida que no exista un usuario con el mismo nombre (case-insensitive)
  const handleSave = async () => {
    setMensaje('');
    setError('');
    setHideMessage(false);
    try {
      // 1. Obtener usuarios existentes
      const resUsuarios = await fetch('/usuarios');
      if (!resUsuarios.ok) throw new Error('No se pudo obtener usuarios');
      const usuarios = await resUsuarios.json();

      // 2. Validar si el usuario ya existe (case-insensitive)
      const existe = usuarios.some(
        u => u.Usuario?.toLowerCase() === usuario.trim().toLowerCase()
      );
      if (existe) {
        setError('El usuario ya existe');
        return;
      }

      // 3. Guardar nuevo usuario
      const res = await fetch('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: usuario, Nombre: nombre }),
      });
      if (res.ok) {
        setMensaje('Usuario agregado correctamente');
        setShowModal(false);
        setUsuario('');
        setNombre('');
        setTimeout(() => setHideMessage(true), 2100);
        setTimeout(() => {
          setMensaje('');
          setHideMessage(false);
        }, 4200);
      } else {
        setError('Error al agregar usuario');
      }
    } catch (error) {
      setError('Error de red o del servidor');
      console.error('Error al agregar usuario:', error);
    }
  };
 return (
    <div className="mtsk-widget-card mtsk-quick-actions">
      {mensaje && (
        <div
          className={
            `mtsk-success-message mtsk-message-visual${hideMessage ? ' mtsk-message-hide' : ''}`
          }
        >
          {mensaje}
        </div>
      )}
      {!showModal && error && (
        <div className="mtsk-error-message mtsk-message-visual">{error}</div>
      )}
      <div className="mtsk-widget-card__header">
        <div className="mtsk-widget-card__icon">
          <FaPlusCircle />
        </div>
        <h3 className="mtsk-widget-card__title">Acciones rápidas</h3>
      </div>
      <div className="mtsk-widget-card__body">
        <div className="mtsk-actions-grid">
          <QuickAction 
            link="#"
            icon={<FaLaptop />} 
            text="Agregar equipo" 
            color="primary"
            onClick={() => setShowEquipoModal(true)}
          />
          <QuickAction 
            link="#"
            icon={<FaUsers />} 
            text="Registrar usuario" 
            color="success"
            onClick={() => setShowModal(true)}
          />
          <QuickAction 
            link="#"
            icon={<FaCheckCircle />}
            text="Equipos disponibles"
            color="warning"
            onClick={() => setShowEquiposDisponibles(true)}
          />
          <QuickAction 
            link="#"
            icon={<FaBoxOpen />} 
            text="Generar reporte" 
            color="info"
            onClick={handleGenerarReporte}
          />
        </div>
      </div>
      {showModal && (
        <div className="mtsk-modal-overlay">
          <div className="mtsk-modal">
            <h4>Registrar usuario</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSave();
              }}
            >
              <div>
                <label>Usuario:</label>
                <input value={usuario} onChange={e => setUsuario(e.target.value)} />
              </div>
              <div>
                <label>Nombre:</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
              {error && (
                <div className="mtsk-error-message mtsk-message-visual" style={{marginTop: 8}}>{error}</div>
              )}
              <div className="mtsk-modal-actions">
                <button type="button" onClick={() => { setShowModal(false); setError(''); }}>Cancelar</button>
                <button type="submit" disabled={!usuario || !nombre}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEquipoModal && (
        <Modal 
          isOpen={showEquipoModal}
          onClose={() => setShowEquipoModal(false)}
          fullScreen={true}
        >
          <AgregarEquipoForm 
            onSubmit={() => setShowEquipoModal(false)}
          />
        </Modal>
      )}
      {showEquiposDisponibles && (
        <EquiposSinAsignar onClose={() => setShowEquiposDisponibles(false)} />
      )}
    </div>
  );
};

export default QuickActions;