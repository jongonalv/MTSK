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

  if (['alta equipo', 'alta de equipo', 'alta usuario', 'alta de usuario'].includes(t)) {
    return <FaPlusCircle />;
  }

  switch(t) {
    case 'editar equipo':
      return <FaClipboardList />;
    case 'asignar usuario':
      return <FaUsers />;
    case 'eliminar equipo':
      return <FaTrashAlt />;
    default:
      return <FaClipboardList />;
  }
};
