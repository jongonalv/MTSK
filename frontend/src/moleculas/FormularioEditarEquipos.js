import React from "react";
import "./estilos/formularios.css";

const EquiposForm = ({ data, onChange }) => {

  // Nombres de las etiquetas para los campos del formulario
  const labelNames = {
    etiquetaEquipo: "Etiqueta",
    tipo: "Tipo",
    procesador: "Procesador",
    discoDuro: "Disco duro",
    memoriaRAM: "Memoria RAM",
    numeroSerie: "Número de serie",
    numeroPedido: "Número de pedido",
    fechaCompra: "Fecha compra",
    garantia: "Garantía",
    empresa: "Empresa",
    marca: "Marca",
    modelo: "Modelo",
    sistemaOperativo: "Sistema Operativo",
  };
  
  // Opciones para los select de tipo, RAM, empresa y sistema operativo
  const tiposOpciones = ["BACKUP", "WORKSTATION", "PORTATIL", "SOBREMESA"];
  const ramOpciones = ["4Gb", "8Gb", "12Gb", "16Gb", "24Gb", "32Gb", "64Gb"];
  const empresasOpciones = ["HT Legazpi", "AG Legazpi", "AG Rozalma"];
  const sistemasOperativosOpciones = ["Windows 10", "Windows 11", "Mac"];

  return (
    <div className="equipos-form-container">
      {Object.keys(labelNames).map((key) => {
        if (key === "usuario") {
          return null;
        }
        let inputElement;

        if (key === "tipo") {
          inputElement = (
            <select id={key} name={key} value={data[key] || ""} onChange={onChange}>
              <option value="">Selecciona tipo</option>
              {tiposOpciones.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        } else if (key === "memoriaRAM") {
          inputElement = (
            <select id={key} name={key} value={data[key] || ""} onChange={onChange}>
              <option value="">Selecciona RAM</option>
              {ramOpciones.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        } else if (key === "fechaCompra") {
          const formattedDate = data[key]
            ? new Date(data[key]).toISOString().split('T')[0]
            : "";
          inputElement = (
            <input
              type="date"
              id={key}
              name={key}
              value={formattedDate}
              onChange={onChange}
            />
          );
        } else if (key === "empresa") {
          inputElement = (
            <select id={key} name={key} value={data[key] || ""} onChange={onChange}>
              <option value="">Selecciona empresa</option>
              {empresasOpciones.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        } else if (key === "sistemaOperativo") {
          inputElement = (
            <select id={key} name={key} value={data[key] || ""} onChange={onChange}>
              <option value="">Selecciona SO</option>
              {sistemasOperativosOpciones.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        } else {
          inputElement = (
            <input
              type="text"
              id={key}
              name={key}
              value={data[key] || ""}
              onChange={onChange}
            />
          );
        }
        return (
          <div key={key} className="form-group">
            <label htmlFor={key}>{labelNames[key]}</label>
            {inputElement}
          </div>
        );
      })}
    </div>
  );
};

export default EquiposForm;