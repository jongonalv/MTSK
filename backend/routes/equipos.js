const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db");

router.get('/equipos', async (req, res) => {
    console.log('➡️ [GET /equipos] Petición recibida');

    try {
        const pool = await poolPromise;
        console.log('🔗 Conexión a SQL Server obtenida');

        const sqlQuery = `
			USE MTSK;
            SELECT 
              dbo.equipo.etiquetaEquipo, dbo.equipo.tipo, dbo.equipo.procesador, dbo.equipo.discoDuro, dbo.equipo.memoriaRAM,
              dbo.equipo.numeroSerie, dbo.equipo.numeroPedido,
              dbo.producto.fechaCompra, dbo.producto.garantia, dbo.producto.empresa, dbo.producto.marca, dbo.producto.modelo,
              dbo.equipo.sistemaOperativo,
              COALESCE(dbo.usuario.Nombre, 'Sin asignar') AS usuario
            FROM dbo.equipo
            INNER JOIN dbo.producto ON dbo.producto.etiqueta = dbo.equipo.etiquetaEquipo
            LEFT JOIN dbo.equipo_has_usuario ON dbo.equipo.etiquetaEquipo = dbo.equipo_has_usuario.etiquetaEquipo
            LEFT JOIN dbo.usuario ON dbo.usuario.Usuario = dbo.equipo_has_usuario.Usuario
        `;

        console.log('📄 Ejecutando consulta SQL...');
        const result = await pool.request().query(sqlQuery);

        console.log(`✅ Consulta completada. Filas recibidas: ${result.recordset.length}`);

        const data = result.recordset.map(row => ({
            ...row,
            fechaCompra: row.fechaCompra ? row.fechaCompra.toISOString().split('T')[0] : null
        }));

        console.log('📦 Datos procesados. Enviando respuesta JSON...');
        res.json(data);

    } catch (err) {
        console.error("❌ Error al consultar SQL Server:", err);
        res.status(500).json({ error: "Error en la consulta" });
    }
});

module.exports = router;
