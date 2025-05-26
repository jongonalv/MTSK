import { useEffect, useState } from 'react';

const calcularStats = (data) => ({
  total: data.length,
  backup: data.filter(e => e.tipo === 'BACKUP').length,
  sinAsignar: data.filter(e => e.usuario === 'Sin asignar').length,
  portatiles: data.filter(e => e.tipo === 'PORTATIL').length,
  workstations: data.filter(e => e.tipo === 'WORKSTATION').length,
  sobremesas: data.filter(e => e.tipo === 'SOBREMESA').length,
  win10: data.filter(e => e.sistemaOperativo?.toLowerCase().includes('windows 10')).length,
  win11: data.filter(e => e.sistemaOperativo?.toLowerCase().includes('windows 11')).length,
});

const useEquiposStats = (fetchEquipos) => {
  const [stats, setStats] = useState({
    total: 0,
    backup: 0,
    sinAsignar: 0,
    portatiles: 0,
    workstations: 0,
    sobremesas: 0,
    win10: 0,
    win11: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const actualizarEstadisticas = async (mostrarLoading = false) => {
      try {
        if (mostrarLoading) setLoading(true);
        const data = await fetchEquipos();
        const nuevasStats = calcularStats(data);

        setStats(prevStats => {
          const esIgual = Object.keys(nuevasStats).every(
            key => nuevasStats[key] === prevStats[key]
          );
          return esIgual ? prevStats : nuevasStats;
        });
      } catch (error) {
        console.error("Error actualizando estadísticas:", error);
      } finally {
        if (mostrarLoading) setLoading(false);
      }
    };

    actualizarEstadisticas(true);

    const intervalo = setInterval(() => {
      actualizarEstadisticas(false);
    }, 10000);

    return () => {
      clearInterval(intervalo);
    };
  }, [fetchEquipos]);

  return { stats, loading };
};

export default useEquiposStats;
