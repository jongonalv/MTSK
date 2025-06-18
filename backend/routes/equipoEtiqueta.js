const express = require("express");
const router = express.Router();
const db = require("../db"); // instancia configurada de mssql

router.get("/equipos/:etiquetaEquipo", async (req, res) => {
    const etiquetaEquipo = req.params.etiquetaEquipo;

    const sqlQuery = `
        SELECT 
            equipo.etiquetaEquipo, equipo.tipo, equipo.procesador, equipo.discoDuro,
            equipo.memoriaRAM, equipo.numeroSerie, equipo.numeroPedido,
            producto.fechaCompra, producto.garantia, producto.empresa, 
            producto.marca, producto.modelo, equipo.sistemaOperativo,
            ISNULL(usuario.Nombre, 'Sin asignar') AS usuario
        FROM equipo 
        INNER JOIN producto ON producto.etiqueta = equipo.etiquetaEquipo
        LEFT JOIN equipo_has_usuario ON equipo.etiquetaEquipo = equipo_has_usuario.etiquetaEquipo
        LEFT JOIN usuario ON usuario.Usuario = equipo_has_usuario.Usuario
        WHERE equipo.etiquetaEquipo = @etiquetaEquipo
    `;

    try {
        const request = new db.Request();
        const result = await request
            .input('etiquetaEquipo', db.VarChar, etiquetaEquipo)
            .query(sqlQuery);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Equipo no encontrado" });
        }

        const equipo = result.recordset[0];

        // Formatear fechaCompra a YYYY-MM-DD si está presente
        if (equipo.fechaCompra) {
            equipo.fechaCompra = equipo.fechaCompra.toISOString().split("T")[0];
        }

        res.json(equipo);

    } catch (err) {
        console.error("Error al consultar la base de datos:", err);
        res.status(500).json({ error: "Error en la consulta" });
    }
});

module.exports = router;
