const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/equipos/:etiquetaEquipo", (req, res) => {
    const etiquetaEquipo = req.params.etiquetaEquipo;
    
    const sqlQuery = `
        SELECT 
            equipo.etiquetaEquipo, equipo.tipo, equipo.procesador, equipo.discoDuro,
            equipo.memoriaRAM, equipo.numeroSerie, equipo.numeroPedido,
            producto.fechaCompra, producto.garantia, producto.empresa, 
            producto.marca, producto.modelo, equipo.sistemaOperativo,
            COALESCE(usuario.Nombre, 'Sin asignar') AS usuario
        FROM equipo 
        INNER JOIN producto ON producto.etiqueta = equipo.etiquetaEquipo
        LEFT JOIN equipo_has_usuario ON equipo.etiquetaEquipo = equipo_has_usuario.etiquetaEquipo
        LEFT JOIN usuario ON usuario.Usuario = equipo_has_usuario.Usuario
        WHERE equipo.etiquetaEquipo = ?
    `;

    db.query(sqlQuery, [etiquetaEquipo], (err, results) => {
        if (err) {
            console.error("Error al consultar la base de datos:", err);
            return res.status(500).json({ error: "Error en la consulta" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Equipo no encontrado" });
        }

        const result = results[0];

        // Formatear la fecha si está presente
        if (result.fechaCompra) {
            result.fechaCompra = result.fechaCompra.toISOString().split("T")[0];
        }

        res.json(result);
    });
});

module.exports = router;
