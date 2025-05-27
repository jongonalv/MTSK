import React, { useState } from 'react';
import './estilos/accesorios.css';

const Accesorios = () => {
  const [metesakaMode, setMetesakaMode] = useState(false);

  return (
    <div className={`accesorios-outer-center${metesakaMode ? ' metesaka-mode' : ''}`}>
      <div className="accesorios-bg-wrapper" />
      <div className={`accesorios-container${metesakaMode ? ' metesaka-crazy' : ''}`}>
        <button className="accesorios-btn mete-btn">
          METE
        </button>
        <button className="accesorios-btn saka-btn">
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
            <div className="metesaka-crazy-text">PLOPLOPLO TRALALERO TRALALA PLOPLOPLO PLOPLOPLO TRALALERO TRALALA PLOPLOPLO PLOPLOPLO TRALALERO TRALALA</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Accesorios;
