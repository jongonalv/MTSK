import React from "react";

const attributeNames = {
  etiquetaEquipo: "Etiqueta de equipo",
  tipo: "Tipo",
  marca: "Marca",
  modelo: "Modelo",
  procesador: "Procesador",
  discoDuro: "Disco duro",
  memoriaRAM: "Memoria RAM",
  numeroSerie: "Número de Serie",
  numeroPedido: "Número de Pedido",
  fechaCompra: "Fecha compra",
  garantia: "Garantía",
  empresa: "Empresa",
};

const EquiposInfo = ({ equipo }) => {
  return (
    <div className="detalles-content">
      {Object.entries(equipo).map(([key, value]) => (
        <p key={key}>
          <strong>{attributeNames[key] || key.replace(/([A-Z])/g, " $1")}: </strong>
          <span>{key === "fechaCompra" ? new Date(value).toISOString().split("T")[0] : value || "N/A"}</span>
        </p>
      ))}
    </div>
  );
};

export default EquiposInfo;
