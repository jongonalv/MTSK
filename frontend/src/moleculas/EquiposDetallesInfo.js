import React from "react";

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

const EquiposInfo = ({ equipo, usuario }) => {
  return (
    <div className="detalles-content">
      {orderedKeys.map((key) => (
        <div key={key} className={`detalle-item ${key === "etiquetaEquipo" || key === "usuario" ? "highlight" : ""}`}>
          <strong className="detalle-label">{attributeNames[key] || key.replace(/([A-Z])/g, " $1")}: </strong>
          <span className="detalle-value">
            {key === "fechaCompra" && equipo[key] ? new Date(equipo[key]).toISOString().split("T")[0] : equipo[key] || usuario[key] || "N/A"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default EquiposInfo;