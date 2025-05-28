import React, { useEffect, useState } from "react";
import axios from "axios";

// Objeto de nombres de atributos
const ATTRIBUTE_NAMES = {
  marca: "Marca",
  modelo: "Modelo",
  etiquetaEquipo: "Etiqueta de equipo",
  tipo: "Tipo",
  procesador: "Procesador",
  discoDuro: "Disco duro",
  memoriaRAM: "Memoria RAM",
  numeroSerie: "Número de Serie",
  numeroPedido: "Número de Pedido",
  fechaCompra: "Fecha compra",
  garantia: "Garantía",
  empresa: "Empresa",
  sistemaOperativo: "Sistema Operativo",
  usuario: "Usuario",
};

// Orden de las claves
const ORDERED_KEYS = [
  "etiquetaEquipo",
  "usuario",
  "marca",
  "modelo",
  "tipo",
  "procesador",
  "discoDuro",
  "memoriaRAM",
  "numeroSerie",
  "numeroPedido",
  "fechaCompra",
  "garantia",
  "empresa",
  "sistemaOperativo",
];

// Función de formateo de valores
const formatValue = (key, value, usuario) => {
  if (key === "fechaCompra" && value) {
    const date = new Date(value);
    return !isNaN(date) ? date.toISOString().split("T")[0] : "N/A";
  }

  if (key === "usuario") {
    return value || usuario?.Nombre || usuario?.Usuario || "Sin asignar";
  }

  return value !== undefined && value !== "" ? value : "N/A";
};

const EquiposInfo = ({ equipo: initialEquipo, usuario }) => {
  const [equipo, setEquipo] = useState(initialEquipo || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Efecto para cargar datos cuando cambia la etiqueta
  useEffect(() => {
    // Si ya tenemos datos iniciales, no hacemos fetch
    if (initialEquipo && Object.keys(initialEquipo).length > 0) {
      setEquipo(initialEquipo);
      return;
    }

    // Si no hay etiqueta, no hacemos fetch
    if (!initialEquipo?.etiquetaEquipo) return;

    const fetchEquipoData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/equipos/${initialEquipo.etiquetaEquipo}`);
        setEquipo(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching equipo data:", err);
        setError("Error al cargar los datos del equipo");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipoData();
  }, [initialEquipo, initialEquipo?.etiquetaEquipo]);

  // Si tenemos datos iniciales, no mostramos loading
  if (!loading && Object.keys(equipo).length === 0) {
    return <div className="error">No se encontraron datos del equipo</div>;
  }

  return (
    <div className="detalles-content">
      {loading ? (
        <div className="loading">Cargando información del equipo...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        ORDERED_KEYS.map((key) => (
          <div
            key={key}
            className={`detalle-item ${
              key === "etiquetaEquipo" || key === "usuario" ? "highlight" : ""
            }`}
          >
            <strong className="detalle-label">
              {ATTRIBUTE_NAMES[key] || key.replace(/([A-Z])/g, " $1")}:
            </strong>
            <span className="detalle-value">
              {formatValue(key, equipo[key], usuario)}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default React.memo(EquiposInfo);