const express = require('express');
const router = express.Router();
const db = require('../db');
const ExcelJS = require('exceljs');

router.get('/reporte-equipos', (req, res) => {
  const sqlQuery = `
    SELECT 
      equipo.etiquetaEquipo, 
      COALESCE(usuario.Nombre, 'Sin asignar') AS usuario,
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

  db.query(sqlQuery, async (err, results) => {
    if (err) {
      console.error('Error al obtener equipos:', err);
      return res.status(500).json({ error: 'Error al obtener equipos' });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Equipos');

      // Estilo de encabezados
      worksheet.columns = [
        { header: 'Etiqueta', key: 'etiquetaEquipo', width: 18 },
        { header: 'Usuario asignado', key: 'usuario', width: 22 },
        { header: 'Tipo', key: 'tipo', width: 14 },
        { header: 'Procesador', key: 'procesador', width: 18 },
        { header: 'Disco Duro', key: 'discoDuro', width: 16 },
        { header: 'Memoria RAM', key: 'memoriaRAM', width: 14 },
        { header: 'Nº Serie', key: 'numeroSerie', width: 18 },
        { header: 'Nº Pedido', key: 'numeroPedido', width: 14 },
        { header: 'Fecha Compra', key: 'fechaCompra', width: 14 },
        { header: 'Garantía', key: 'garantia', width: 12 },
        { header: 'Empresa', key: 'empresa', width: 16 },
        { header: 'Marca', key: 'marca', width: 14 },
        { header: 'Modelo', key: 'modelo', width: 14 },
        { header: 'Sistema Operativo', key: 'sistemaOperativo', width: 18 },
      ];

      // Encabezado con estilo
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' }
      };

      // Formatear fecha y agregar filas
      results.forEach(equipo => {
        if (equipo.fechaCompra && equipo.fechaCompra instanceof Date) {
          equipo.fechaCompra = equipo.fechaCompra.toISOString().split('T')[0];
        }
        worksheet.addRow(equipo);
      });

      // Bordes y ajuste de texto
      worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
        row.eachCell({ includeEmpty: false }, function(cell) {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
            right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=reporte_equipos.xlsx'
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      res.status(500).json({ error: 'Error al generar el reporte' });
    }
  });
});

module.exports = router;