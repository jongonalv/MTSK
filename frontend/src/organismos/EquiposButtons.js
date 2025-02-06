import React from "react";
import BotonSinpleRojo from "../atomos/botonSinple";
import BotonAgregar from "../atomos/agregarButton";

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

const EquiposButtons = ({ setIsModalOpen, equipo }) => {
  return (
    <div className="botones-container">
      <div className="botones-fila">
        <BotonSinpleRojo label="Imprimir" onClick={() => handlePrint(equipo)} className="fade-in" />
        <BotonSinpleRojo label="Editar" onClick={() => setIsModalOpen(true)} className="fade-in" />
      </div>
      <BotonAgregar label="SAKA" onClick={() => console.log("Eliminar")} className="fade-in boton-saka" />
    </div>
  );
};

export default EquiposButtons;
