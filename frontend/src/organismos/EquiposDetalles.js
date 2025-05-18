import React, { useState, useEffect } from "react";
import EquiposInfo from "../moleculas/EquiposDetallesInfo";
import EquiposModal from "../moleculas/EquiposModal";
import EquiposButtons from "../moleculas/EquiposButtons";
import "./estilos/equipos.css";
import "./estilos/formPopup.css";
import "./estilos/equiposDetalles.css"; 

const EquiposDetail = ({ equipo, reloadEquipos, fetchEquipos }) => {
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
    usuario: equipo.usuario || "",
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
      usuario: equipo.usuario || "",
    });
  }, [equipo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para guardar los cambios en el equipo
  // Envía los datos editados a los endpoints correspondientes
  const handleSave = async () => {
    try {
      setError(null);

      await fetch("http://localhost:3001/updateProducto", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          etiqueta: editableData.etiquetaEquipo,
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
          usuario: editableData.usuario,
        }),
      });

      setIsModalOpen(false);

      // Actualiza el estado local con los datos editados
      setEditableData({ ...editableData });

      // Recarga los equipos después de guardar
      setTimeout(() => {
        reloadEquipos();
        fetchEquipos();
      }, 200);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2 className="fade-in">Detalles del Equipo</h2>
      <EquiposInfo equipo={editableData} fetchEquipos={fetchEquipos} />
      {error && <div className="error-message">{error}</div>}
      <EquiposButtons 
        setIsModalOpen={setIsModalOpen} 
        equipo={editableData} 
        onEquiposUpdated={reloadEquipos}
        reloadEquipos={reloadEquipos}
        fetchEquipos={fetchEquipos} 
      />
      <EquiposModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={editableData} 
        onChange={handleInputChange} 
        onSave={handleSave} 
        reloadEquipos={reloadEquipos}
        fetchEquipos={fetchEquipos} 
      />
    </div>
  );
};

export default EquiposDetail;