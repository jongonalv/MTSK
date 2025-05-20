export const printEquipo = (equipo) => {
    const qrCodeData = JSON.stringify({
      etiquetaEquipo: equipo.etiquetaEquipo,
      numeroSerie: equipo.numeroSerie,
      fechaCompra: equipo.fechaCompra,
    });
  
    const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=150x150`;
    const printWindow = window.open("", "_blank", "width=400,height=300");
    printWindow.document.open();
  
    // Estilo para la impresión
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