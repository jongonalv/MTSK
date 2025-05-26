import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children, fullScreen = false }) => {
  const elRef = useRef(null);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'modal-root');
      document.body.appendChild(modalRoot);
    }

    modalRoot.appendChild(elRef.current);

    return () => {
      modalRoot.removeChild(elRef.current);
      if (modalRoot.childNodes.length === 0) {
        modalRoot.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${fullScreen ? 'full-screen' : ''}`} onClick={onClose}>
      <div
        className={`modal-content ${fullScreen ? 'full-screen-content' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-children-container">{children}</div>
      </div>
    </div>,
    elRef.current
  );
};

export default React.memo(Modal);
