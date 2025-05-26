import React, { useState } from 'react';
import { FaPlusCircle, FaLaptop, FaUsers, FaClipboardList, FaBoxOpen } from 'react-icons/fa';
import QuickAction from '../moleculas/componentes_inicio/QuickAction';
import './estilos/QuickActions.css'; // Asegúrate de tener este archivo CSS para estilos

const QuickActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [hideMessage, setHideMessage] = useState(false); // Nuevo estado

  const handleSave = async () => {
    setMensaje('');
    setError('');
    setHideMessage(false);
    try {
      // 1. Obtener usuarios existentes
      const resUsuarios = await fetch('http://localhost:3001/usuarios');
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
      const res = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: usuario, Nombre: nombre }),
      });
      if (res.ok) {
        setMensaje('Usuario agregado correctamente');
        setShowModal(false);
        setUsuario('');
        setNombre('');
        setTimeout(() => setHideMessage(true), 2100); // espera 2.1s antes de iniciar el fadeout
        setTimeout(() => {
          setMensaje('');
          setHideMessage(false);
        }, 4200); // espera 2s más (total ~4.2s) antes de quitar el mensaje
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
      {error && (
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
            link="#/agregar-equipo" 
            icon={<FaLaptop />} 
            text="Agregar equipo" 
            color="primary"
          />
          <QuickAction 
            link="#"
            icon={<FaUsers />} 
            text="Registrar usuario" 
            color="success"
            onClick={() => {
              setShowModal(true);
              setError('');
            }}
          />
          <QuickAction 
            link="#/asignar-equipo" 
            icon={<FaClipboardList />} 
            text="Asignar equipo" 
            color="warning"
          />
          <QuickAction 
            link="#/reportes" 
            icon={<FaBoxOpen />} 
            text="Generar reporte" 
            color="info"
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
    </div>
  );
};

export default QuickActions;