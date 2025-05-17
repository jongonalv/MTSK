import React, { useState } from "react";
import BotonSinpleRojo from "../atomos/botonSinple";
import AsignarUsuarioPopup from "./AsignarUsuarioPopup";

const EquiposButtons = ({ setIsModalOpen, equipo, onEquiposUpdated, reloadEquipos }) => {
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);

  // Función para imprimir los detalles del equipo
 const handlePrint = (equipo) => {
  const qrCodeData = JSON.stringify({
    etiquetaEquipo: equipo.etiquetaEquipo,
    numeroSerie: equipo.numeroSerie,
    fechaCompra: equipo.fechaCompra,
  });

  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=150x150`;
  const printWindow = window.open("", "_blank", "width=400,height=300");
  printWindow.document.open();

  // Estilo para la impresión
  // Se establece un tamaño fijo para la etiqueta
  printWindow.document.write(`
    <html>
      <head>
        <title>Etiqueta de Equipo</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 0;
              width: 60mm;
              height: 40mm;
              font-size: 10pt;
            }
          }
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 5mm;
            margin: 0;
          }
          .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 5px auto;
          }
          .info {
            font-size: 10pt;
            margin: 0;
            line-height: 1.2;
          }
        </style>
      </head>
      <body>
        <img class="qr-code" src="${qrCodeSrc}" alt="QR Code" />
        <p class="info"><strong>Etiqueta:</strong> ${equipo.etiquetaEquipo}</p>
        <p class="info"><strong>Serie:</strong> ${equipo.numeroSerie || "N/A"}</p>
        <p class="info"><strong>Compra:</strong> ${equipo.fechaCompra || "N/A"}</p>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => printWindow.print();
};


  /* Función para eliminar un equipo
    Se muestra un mensaje de confirmación antes de eliminar
    Si el usuario confirma, se realiza la eliminación
    y se llama a la función onEquiposUpdated para actualizar la lista */
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

  // Función para asignar un usuario a un equipo
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
          reloadEquipos={reloadEquipos}
        />
      )}
    </div>
  );
};

export default EquiposButtons;