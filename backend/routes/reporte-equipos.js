const express = require('express');
const router = express.Router();
const db = require('../db'); // debe exportar poolPromise y sql
const ExcelJS = require('exceljs');

router.get('/reporte-equipos', async (req, res) => {
  const sqlQuery = `
    SELECT 
      equipo.etiquetaEquipo, 
      ISNULL(usuario.Nombre, 'Sin asignar') AS usuario,
      equipo.tipo, 
      equipo.procesador, 
      equipo.discoDuro, 
      equipo.memoriaRAM, 
      equipo.numeroSerie, 
      equipo.numeroPedido, 
      producto.fechaCompra, 
      producto.garantia, 
      producto.empresa, 
      producto.marca, 
      producto.modelo, 
      equipo.sistemaOperativo
    FROM equipo 
    INNER JOIN producto ON producto.etiqueta = equipo.etiquetaEquipo
    LEFT JOIN equipo_has_usuario ON equipo.etiquetaEquipo = equipo_has_usuario.etiquetaEquipo
    LEFT JOIN usuario ON usuario.Usuario = equipo_has_usuario.Usuario
  `;

  try {
    const pool = await db.poolPromise;
    const result = await pool.request().query(sqlQuery);
    const equipos = result.recordset;

    const workbook = new ExcelJS.Workbook();

    const tipoColores = [
      'FFD1FAE5', 'FFDBEAFE', 'FFFEE2E2', 'FFEDE9FE',
      'FFFFF7CD', 'FFDCFCE7', 'FFF0F9FF', 'FFFFF1F2'
    ];
    const white = 'FFFFFFFF';
    const grayBorder = 'FFCBD5E1';
    const greenText = 'FF15803D';
    const redText = 'FFB91C1C';
    const pinkFill = 'FFFFEBEB';

    const resumenSheet = workbook.addWorksheet('Resumen General');
    resumenSheet.columns = [
      { header: 'Tipo de equipo', key: 'tipo', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
      { header: 'Acceso', key: 'link', width: 40 }
    ];
    resumenSheet.getRow(1).font = { bold: true, color: { argb: white }, size: 13 };
    resumenSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF64748B' }
    };

    const tipos = {};
    equipos.forEach(equipo => {
      const tipo = equipo.tipo || 'Sin especificar';
      if (!tipos[tipo]) tipos[tipo] = [];
      tipos[tipo].push(equipo);
    });

    let tipoIndex = 0;

    for (const tipo in tipos) {
      const sheet = workbook.addWorksheet(tipo.substring(0, 31));
      const headerFill = tipoColores[tipoIndex % tipoColores.length];
      tipoIndex++;

      sheet.views = [{ state: 'frozen', ySplit: 1 }];
      sheet.columns = [
        { header: 'Etiqueta', key: 'etiquetaEquipo', width: 18 },
        { header: 'Usuario asignado', key: 'usuario', width: 22 },
        { header: 'Procesador', key: 'procesador', width: 18 },
        { header: 'Disco Duro', key: 'discoDuro', width: 16 },
        { header: 'Memoria RAM', key: 'memoriaRAM', width: 14 },
        { header: 'Nº Serie', key: 'numeroSerie', width: 18 },
        { header: 'Nº Pedido', key: 'numeroPedido', width: 14 },
        { header: 'Fecha Compra', key: 'fechaCompra', width: 14 },
        { header: 'Garantía (meses)', key: 'garantia', width: 14 },
        { header: 'Estado Garantía', key: 'estadoGarantia', width: 16 },
        { header: 'Empresa', key: 'empresa', width: 16 },
        { header: 'Marca', key: 'marca', width: 14 },
        { header: 'Modelo', key: 'modelo', width: 14 },
        { header: 'Sistema Operativo', key: 'sistemaOperativo', width: 18 },
        { header: 'Resumen Técnico', key: 'resumen', width: 45 }
      ];

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FF111827' }, size: 12 };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerFill }
      };

      tipos[tipo].forEach(equipo => {
        let fechaCompra = equipo.fechaCompra instanceof Date
          ? equipo.fechaCompra
          : new Date(equipo.fechaCompra);

        let estadoGarantia = 'Sin fecha';
        if (!isNaN(fechaCompra)) {
          const meses = parseInt(equipo.garantia || 0, 10);
          const fechaFin = new Date(fechaCompra);
          fechaFin.setMonth(fechaFin.getMonth() + meses);
          estadoGarantia = fechaFin >= new Date() ? 'Activa' : 'Vencida';
        }

        const resumen = `${equipo.marca || ''} ${equipo.modelo || ''}, ${equipo.procesador || ''}, ${equipo.memoriaRAM || ''} RAM, ${equipo.discoDuro || ''}`;

        sheet.addRow({
          ...equipo,
          fechaCompra: fechaCompra.toLocaleDateString('es-ES'),
          estadoGarantia,
          resumen
        });
      });

      sheet.autoFilter = 'A1:O1';

      sheet.eachRow({ includeEmpty: false }, (row, i) => {
        row.eachCell({ includeEmpty: false }, cell => {
          cell.font = { name: 'Calibri', size: 11 };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: grayBorder } },
            left: { style: 'thin', color: { argb: grayBorder } },
            bottom: { style: 'thin', color: { argb: grayBorder } },
            right: { style: 'thin', color: { argb: grayBorder } }
          };
          if (i % 2 === 0 && i > 1) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF8FAFC' }
            };
          }
        });

        const estado = row.getCell('estadoGarantia').value;
        if (estado === 'Vencida') {
          row.getCell('estadoGarantia').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: pinkFill }
          };
          row.getCell('estadoGarantia').font = { color: { argb: redText }, bold: true };
        } else if (estado === 'Activa') {
          row.getCell('estadoGarantia').font = { color: { argb: greenText }, bold: true };
        }
      });

      resumenSheet.addRow({
        tipo,
        cantidad: tipos[tipo].length,
        link: {
          text: `Ver ${tipo}`,
          hyperlink: `#'${tipo}'!A1`,
          font: { color: { argb: 'FF2563EB' }, underline: true }
        }
      });
    }

    resumenSheet.eachRow({ includeEmpty: false }, row => {
      row.eachCell({ includeEmpty: false }, cell => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 12 };
        cell.border = {
          top: { style: 'thin', color: { argb: grayBorder } },
          bottom: { style: 'thin', color: { argb: grayBorder } }
        };
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte_equipos_plantilla_suave.xlsx');
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error('❌ Error al generar el reporte:', err);
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
});

module.exports = router;
