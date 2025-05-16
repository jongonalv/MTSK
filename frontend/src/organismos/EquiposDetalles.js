import React, { useState, useEffect } from "react";
import EquiposInfo from "../moleculas/EquiposDetallesInfo";
import EquiposModal from "../moleculas/EquiposModal";
import EquiposButtons from "../moleculas/EquiposButtons";
import "./estilos/equipos.css";
import "./estilos/formPopup.css";
import "./estilos/equiposDetalles.css"; 

const EquiposDetail = ({ equipo, reloadEquipos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableData, setEditableData] = useState({
    etiquetaEquipo: equipo.etiquetaEquipo || "",
    tipo: equipo.tipo || "",
    procesador: equipo.procesador || "",
    discoDuro: equipo.discoDuro || "",
    memoriaRAM: equipo.memoriaRAM || "",
    numeroSerie: equipo.numeroSerie || "",
    numeroPedido: equipo.numeroPedido || "",
    fechaCompra: equipo.fechaCompra || "",
    garantia: equipo.garantia || "",
    empresa: equipo.empresa || "",
    marca: equipo.marca || "",
    modelo: equipo.modelo || "",
    sistemaOperativo: equipo.sistemaOperativo || "",
    usuario: equipo.usuario || "", // Asegúrate de incluir la propiedad usuario
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setEditableData({
      etiquetaEquipo: equipo.etiquetaEquipo || "",
      tipo: equipo.tipo || "",
      procesador: equipo.procesador || "",
      discoDuro: equipo.discoDuro || "",
      memoriaRAM: equipo.memoriaRAM || "",
      numeroSerie: equipo.numeroSerie || "",
      numeroPedido: equipo.numeroPedido || "",
      fechaCompra: equipo.fechaCompra || "",
      garantia: equipo.garantia || "",
      empresa: equipo.empresa || "",
      marca: equipo.marca || "",
      modelo: equipo.modelo || "",
      sistemaOperativo: equipo.sistemaOperativo || "",
      usuario: equipo.usuario || "", // Asegúrate de incluir la propiedad usuario
    });
  }, [equipo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      await fetch("http://localhost:3001/updateProducto", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          etiqueta: editableData.etiqueta,
          fechaCompra: editableData.fechaCompra,
          garantia: editableData.garantia,
          empresa: editableData.empresa,
          marca: editableData.marca,
          modelo: editableData.modelo,
        }),
      });

      await fetch("http://localhost:3001/updateEquipo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          etiquetaEquipo: editableData.etiquetaEquipo,
          tipo: editableData.tipo,
          procesador: editableData.procesador,
          discoDuro: editableData.discoDuro,
          memoriaRAM: editableData.memoriaRAM,
          numeroSerie: editableData.numeroSerie,
          numeroPedido: editableData.numeroPedido,
          sistemaOperativo: editableData.sistemaOperativo,
          usuario: editableData.usuario, // Asegúrate de incluir la propiedad usuario
        }),
      });

      setIsModalOpen(false);
      setTimeout(() => {
        reloadEquipos();
        setEditableData(equipo); // Recargar la información del equipo
      }, 200);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2 className="fade-in">Detalles del Equipo</h2>
      <EquiposInfo equipo={editableData} />
      {error && <div className="error-message">{error}</div>}
      <EquiposButtons 
        setIsModalOpen={setIsModalOpen} 
        equipo={editableData} 
        onEquiposUpdated={reloadEquipos}
      />
      <EquiposModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={editableData} 
        onChange={handleInputChange} 
        onSave={handleSave} 
        reloadEquipos={reloadEquipos} // Pasar reloadEquipos aquí
      />
    </div>
  );
};

export default EquiposDetail;