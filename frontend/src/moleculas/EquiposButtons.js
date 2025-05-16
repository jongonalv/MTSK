import React, { useState } from "react";
import BotonSinpleRojo from "../atomos/botonSinple";
import AsignarUsuarioPopup from "./AsignarUsuarioPopup";

const EquiposButtons = ({ setIsModalOpen, equipo, onEquiposUpdated }) => {
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);

  const handlePrint = (equipo) => {
    const qrCodeData = JSON.stringify({
      etiquetaEquipo: equipo.etiquetaEquipo,
      numeroSerie: equipo.numeroSerie,
      fechaCompra: equipo.fechaCompra,
    });

    const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=200x200`;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.open();

    printWindow.document.write(`
      <html>
        <head>
          <title>Impresión de Detalles</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10px;
            }
            .qr-code {
              display: block;
              margin: 20px auto;
              max-width: 200px;
            }
          </style>
        </head>
        <body>
          <h2>Etiqueta de Equipo</h2>
          <p><strong>Etiqueta Equipo:</strong> ${equipo.etiquetaEquipo}</p>
          <p><strong>Número de Serie:</strong> ${equipo.numeroSerie || "N/A"}</p>
          <p><strong>Fecha de Compra:</strong> ${equipo.fechaCompra || "N/A"}</p>
          <img class="qr-code" src="${qrCodeSrc}" alt="QR Code" />
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  const handleDelete = async (equipo) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el equipo ${equipo.etiquetaEquipo}?`);
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3001/equipo/${equipo.etiquetaEquipo}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el equipo');
        }

        alert('Equipo eliminado correctamente');
        onEquiposUpdated(); // Llamar a onEquiposUpdated después de eliminar
      } catch (error) {
        console.error(error);
        alert('Error al eliminar el equipo');
      }
    }
  };

  const handleAssign = async (equipo, usuario) => {
    try {
      const response = await fetch(`http://localhost:3001/equipo/${equipo.etiquetaEquipo}/asignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario }),
      });

      if (!response.ok) {
        throw new Error('Error al asignar el usuario');
      }

      alert('Usuario asignado correctamente');
      onEquiposUpdated();
      setIsAssignPopupOpen(false); 
    } catch (error) {
      console.error(error);
      alert('Error al asignar el usuario');
    }
  };

  return (
    <div className="botones-container">
      <div className="botones-fila">
        <BotonSinpleRojo label="Imprimir" onClick={() => handlePrint(equipo)} className="fade-in" />
        <BotonSinpleRojo label="Editar" onClick={() => setIsModalOpen(true)} className="fade-in" />
        <BotonSinpleRojo label="Asignar" onClick={() => setIsAssignPopupOpen(true)} className="fade-in" />
        <BotonSinpleRojo label="SAKA" onClick={() => handleDelete(equipo)} className="fade-in boton-saka" />
      </div>
      {isAssignPopupOpen && (
        <AsignarUsuarioPopup
          equipo={equipo}
          onClose={() => {
            setIsAssignPopupOpen(false);
            onEquiposUpdated();
          }}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default EquiposButtons;