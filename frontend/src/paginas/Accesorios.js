import React, { useState, useEffect } from 'react';
import './estilos/accesorios.css';

const Accesorios = () => {
  const [metesakaMode, setMetesakaMode] = useState(false);
  const [accesorios, setAccesorios] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar accesorios desde el backend
  useEffect(() => {
    fetch('/accesorios')
      .then(res => res.json())
      .then(data => {
        setAccesorios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const accesorio = accesorios.find(a => a.etiquetaAccesorio === selected);

  const handleStock = async (accion) => {
    try {
      const res = await fetch('/accesorios/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etiquetaAccesorio: selected, accion })
      });
      if (res.ok) {
        // Opcional: recargar accesorios para actualizar el stock
        const updated = await fetch('/accesorios').then(r => r.json());
        setAccesorios(updated);
      } else {
        alert('Error al modificar el stock');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  return (
    <div className={`accesorios-outer-center${metesakaMode ? ' metesaka-mode' : ''}`}>
      <div className="accesorios-bg-wrapper" />
      <div className={`accesorios-container${metesakaMode ? ' metesaka-crazy' : ''}`}>
        {loading ? (
          <div>Cargando accesorios...</div>
        ) : !selected ? (
          <div style={{ width: '100%' }}>
            <label htmlFor="accesorio-select" style={{ fontWeight: 700, fontSize: '1.2rem' }}>
              Elige un accesorio:
            </label>
            <select
              id="accesorio-select"
              value={selected}
              onChange={e => setSelected(e.target.value)}
              style={{ marginLeft: 12, fontSize: '1.1rem', padding: '0.3rem 1rem', borderRadius: 8 }}
            >
              <option value="">-- Selecciona --</option>
              {accesorios.map(a => (
                <option key={a.etiquetaAccesorio} value={a.etiquetaAccesorio}>
                  {a.nombreProducto}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
             <header className="accesorios-header">
              <h2>{accesorio.nombreProducto}</h2>
              <div className="accesorios-stock">
                Stock actual: {accesorio.Stock}
              </div>
              <div className="accesorios-desc">
                {accesorio.descripcion}
              </div>
            </header>
            <button className="accesorios-btn mete-btn" onClick={() => handleStock('mete')}>
              METE
            </button>
            <button className="accesorios-btn saka-btn" onClick={() => handleStock('saka')}>
              SAKA
            </button>
            <button
              className={`accesorios-btn-metesaka accesorios-btn-metesaka-hidden${metesakaMode ? ' metesaka-active' : ''}`}
              onClick={() => setMetesakaMode(m => !m)}
              title="Activa el modo metesaka"
            >
              {metesakaMode ? '¡YA VALE!' : 'metesaka?'}
            </button>
            {metesakaMode && (
              <>
                <div className="metesaka-confetti" />
                <div className="metesaka-emoji-crazy">
                  <span role="img" aria-label="party">🎉</span>
                  <span role="img" aria-label="fire">🔥</span>
                  <span role="img" aria-label="alien">👽</span>
                  <span role="img" aria-label="unicorn">🦄</span>
                  <span role="img" aria-label="rocket">🚀</span>
                  <span role="img" aria-label="eyes">👀</span>
                  <span role="img" aria-label="star">🌟</span>
                  <span role="img" aria-label="explosion">💥</span>
                </div>
                <div className="metesaka-crazy-text">
                  PLOPLOPLO TRALALERO TRALALA PLOPLOPLO PLOPLOPLO TRALALERO TRALALA PLOPLOPLO PLOPLOPLO TRALALERO TRALALA
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Accesorios;