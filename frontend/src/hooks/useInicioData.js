import { useEffect, useState, useCallback } from 'react';

export const useInicioData = () => {
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMov, setLoadingMov] = useState(true);

  // Funciones para cargar equipos, usuarios y movimientos
  const fetchEquiposYUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const [equiposRes, usuariosRes] = await Promise.all([
        fetch('http://localhost:3001/equipos'),
        fetch('http://localhost:3001/usuarios')
      ]);
      setEquipos(await equiposRes.json());
      setUsuarios(await usuariosRes.json());
    } catch (err) {
      console.error("Error al cargar equipos o usuarios:", err);
    }
    setLoading(false);
  }, []);

  const fetchMovimientos = useCallback(async () => {
    setLoadingMov(true);
    try {
      const res = await fetch('http://localhost:3001/movimientos?_limit=5&_sort=fecha&_order=desc');
      setMovimientos(await res.json());
    } catch (err) {
      console.error("Error al cargar movimientos:", err);
    }
    setLoadingMov(false);
  }, []);

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    fetchEquiposYUsuarios();
    fetchMovimientos();
  }, [fetchEquiposYUsuarios, fetchMovimientos]);

  // Función para calcular estadísticas
  const calcularEstadisticas = () => {
    if (loading) return {};

    const totalEquipos = equipos.length;
    const equiposSinAsignar = equipos.filter(e => e.usuario === 'Sin asignar').length;
    const equiposDisponibles = equipos.filter(e => e.estado === 'Disponible').length;

    const tiposEquipos = equipos.reduce((acc, e) => {
      acc[e.tipo] = (acc[e.tipo] || 0) + 1;
      return acc;
    }, {});

    const procesadores = equipos.reduce((acc, e) => {
      if (e.procesador) acc[e.procesador] = (acc[e.procesador] || 0) + 1;
      return acc;
    }, {});

    const memoriaRAM = equipos.reduce((acc, e) => {
      if (e.memoriaRAM) acc[e.memoriaRAM] = (acc[e.memoriaRAM] || 0) + 1;
      return acc;
    }, {});

    const discosDuros = equipos.reduce((acc, e) => {
      if (e.discoDuro) acc[e.discoDuro] = (acc[e.discoDuro] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEquipos,
      equiposSinAsignar,
      equiposDisponibles,
      tiposEquipos,
      procesadores,
      memoriaRAM,
      discosDuros,
      totalUsuarios: usuarios.length
    };
  };

  // Calcular estadísticas
  const stats = calcularEstadisticas();

  // Obtener los últimos 5 equipos comprados y los equipos sin asignar
  const ultimosEquipos = [...equipos]
    .sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra))
    .slice(0, 5);

  // Filtrar los equipos sin asignar
  const equiposSinAsignarList = equipos
    .filter(e => e.usuario === 'Sin asignar')
    .slice(0, 5);

  return {
    equipos,
    usuarios,
    movimientos,
    stats,
    loading,
    loadingMov,
    ultimosEquipos,
    equiposSinAsignarList,
  };
};