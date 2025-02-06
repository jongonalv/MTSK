import React, { useState, useEffect } from "react";
import EquiposInfo from "./EquiposInfo";
import EquiposModal from "./EquiposModal";
import EquiposButtons from "./EquiposButtons";
import "./equipos.css";
import "./formPopup.css";
import "./equiposDetalles.css"; 

const EquiposDetail = ({ equipo, reloadEquipos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableData, setEditableData] = useState(equipo);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEditableData(equipo);
  }, [equipo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: name === "fechaCompra" ? new Date(value).toISOString().split("T")[0] : value,
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
        }),
      });

      setIsModalOpen(false);
      setTimeout(() => reloadEquipos(), 200);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2 className="fade-in">Detalles del Equipo</h2>
      <EquiposInfo equipo={equipo} />
      {error && <div className="error-message">{error}</div>}
      <EquiposButtons 
        setIsModalOpen={setIsModalOpen} 
        equipo={equipo} 
      />
      <EquiposModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={editableData} 
        onChange={handleInputChange} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default EquiposDetail;
