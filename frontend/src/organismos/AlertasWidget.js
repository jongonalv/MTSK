import React, { useEffect, useState } from 'react';

const AlertasWidget = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verTodas, setVerTodas] = useState(false);

  useEffect(() => {
    fetch('/alertas')
      .then(res => res.json())
      .then(data => {
        setAlertas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Ordenar por fecha descendente (más reciente primero)
  const alertasOrdenadas = [...alertas].sort(
    (a, b) => new Date(b.Fecha) - new Date(a.Fecha)
  );

  // Mostrar solo las 8 más recientes si no se pulsa "ver todas"
  const alertasMostradas = verTodas ? alertasOrdenadas : alertasOrdenadas.slice(0, 8);

  return (
    <div className="alertas-widget">
      <h3>Alertas de Stock</h3>
      {loading ? (
        <div>Cargando alertas...</div>
      ) : alertasOrdenadas.length === 0 ? (
        <div className="alertas-widget-vacio">No hay alertas activas 🎉</div>
      ) : (
        <>
          <ul>
            {alertasMostradas.map(alerta => (
              <li key={alerta.id}>
                <strong>{alerta.etiquetaProducto}</strong>: {alerta.Mensaje}
                <span style={{ fontSize: '0.85em', color: '#888', marginLeft: 8 }}>
                  {new Date(alerta.Fecha).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          {alertasOrdenadas.length > 8 && !verTodas && (
            <div style={{ textAlign: 'center', marginTop: '0.7rem' }}>
              <button
                className="alertas-widget-ver-todas"
                onClick={() => setVerTodas(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#da321c',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textDecoration: 'underline'
                }}
              >
                Ver todas las alertas
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlertasWidget;