import React from "react";

// Nombres de los atributos para mostrar en la interfaz
const attributeNames = {
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

// Lista de claves en el orden deseado
const orderedKeys = [
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

const getValue = (key, equipo, usuario) => {

  // Formatea la fehca de compra en caso de que sea válida
  // y devuelve "N/A" en caso de que no lo sea
  if (key === "fechaCompra" && equipo[key]) {
    const date = new Date(equipo[key]);
    return !isNaN(date) ? date.toISOString().split("T")[0] : "N/A";
  }

  // Devuelve "Sin asignar" en caso de que el usuario no esté asignado
  if (key === "usuario") {
    return equipo[key] || usuario?.Nombre || usuario?.Usuario || "Sin asignar";
  }
  return equipo[key] !== undefined && equipo[key] !== "" ? equipo[key] : "N/A";
};

// Componente para mostrar la información de los equipos
// Recibe un objeto "equipo" y un objeto "usuario" como props
const EquiposInfo = ({ equipo, usuario }) => {

  return (
    <div className="detalles-content">
      {orderedKeys.map((key) => (
        <div
          key={key}
          className={`detalle-item ${key === "etiquetaEquipo" || key === "usuario" ? "highlight" : ""}`}
        >
          <strong className="detalle-label">
            {attributeNames[key] || key.replace(/([A-Z])/g, " $1")}:
          </strong>
          <span className="detalle-value">{getValue(key, equipo, usuario)}</span>
        </div>
      ))}
    </div>
  );
};

export default EquiposInfo;