import { useState, useEffect } from 'react';

export function useUsuariosSearch() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios`);
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    };
    fetchUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(user =>
    user.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { usuarios, searchTerm, setSearchTerm, filteredUsuarios };
}