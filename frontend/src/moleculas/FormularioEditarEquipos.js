import React from "react";
import { useRef } from "react";
import "./estilos/formularios.css";
import { useEtiquetaEquipo } from "../hooks/useEditarEquipos";

const EquiposForm = ({ data, onChange }) => {

  const etiquetaOriginalRef = useRef(data.etiquetaEquipo);
  const { handleCampoChange } = useEtiquetaEquipo(data, onChange, etiquetaOriginalRef);

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
    backup: "¿Es Backup?",
  };

  const tiposOpciones = ["WORKSTATION", "PORTATIL", "SOBREMESA"];
  const ramOpciones = ["4Gb", "8Gb", "12Gb", "16Gb", "24Gb", "32Gb", "64Gb"];
  const empresasOpciones = ["HT Legazpi", "AG Legazpi", "AG Rozalma"];
  const sistemasOperativosOpciones = ["Windows 10", "Windows 11", "Mac"];

  return (
    <div className="equipos-form-container">
      {Object.keys(labelNames).map((key) => {
        if (key === "usuario") return null;

        let inputElement;

        if (key === "tipo") {
          inputElement = (
            <select id={key} name={key} value={data[key] || ""} onChange={handleCampoChange}>
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
            <select id={key} name={key} value={data[key] || ""} onChange={handleCampoChange}>
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
              onChange={handleCampoChange}
            />
          );
        } else if (key === "empresa") {
          inputElement = (
            <select id={key} name={key} value={data[key] || ""} onChange={handleCampoChange}>
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
            <select id={key} name={key} value={data[key] || ""} onChange={handleCampoChange}>
              <option value="">Selecciona SO</option>
              {sistemasOperativosOpciones.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        } else if (key === "backup") {
          inputElement = (
            <input
              type="checkbox"
              id={key}
              name={key}
              checked={data[key] || false}
              onChange={handleCampoChange}
            />
          );
        } else if (key === "etiquetaEquipo") {
          inputElement = (
            <input
              type="text"
              id={key}
              name={key}
              value={data[key] || ""}
              readOnly
            />
          );
        } else {
          inputElement = (
            <input
              type="text"
              id={key}
              name={key}
              value={data[key] || ""}
              onChange={handleCampoChange}
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
