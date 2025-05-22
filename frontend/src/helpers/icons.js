// src/helpers/icons.js
import { 
  FaClipboardList, 
  FaPlusCircle, 
  FaUsers, 
  FaTrashAlt 
} from 'react-icons/fa';

/**
 * Devuelve el icono correspondiente según el tipo de movimiento.
 * @param {string} tipo - Tipo de movimiento.
 * @returns JSX.Element
 */
export const getActivityIcon = (tipo) => {
  if (!tipo) return <FaClipboardList />;
  const t = tipo.trim().toLowerCase();
  switch(t) {
    case 'editar equipo':
      return <FaClipboardList />;
    case 'alta equipo':
    case 'alta de equipo':
      return <FaPlusCircle />;
    case 'asignar usuario':
      return <FaUsers />;
    case 'eliminar equipo':
      return <FaTrashAlt />;
    default:
      return <FaClipboardList />;
  }
};
