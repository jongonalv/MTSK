// src/helpers/colors.js

/**
 * Devuelve un color asociado al tipo de equipo.
 * @param {string} tipo - Tipo de equipo.
 * @returns {string} - Código hexadecimal de color.
 */
export const getColorForType = (tipo) => {
  const colors = {
    'Laptop': '#4361ee',
    'Desktop': '#3f37c9',
    'Servidor': '#4cc9f0',
    'Tablet': '#f72585',
    'Impresora': '#f8961e',
    'Monitor': '#4895ef'
  };
  return colors[tipo] || '#6c757d';
};
