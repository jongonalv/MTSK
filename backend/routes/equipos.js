const express = require("express");
const router = express.Router();
const db = require("../db");

router.get('/equipos', (req, res) => {
    const sqlQuery = `
        SELECT 
            equipo.etiquetaEquipo, equipo.tipo, equipo.procesador, equipo.discoDuro, equipo.memoriaRAM, equipo.numeroSerie, equipo.numeroPedido, producto.fechaCompra, producto.garantia, producto.empresa, producto.marca, producto.modelo, equipo.sistemaOperativo,
            COALESCE(usuario.Nombre, 'Sin asignar') AS usuario
        FROM equipo 
        INNER JOIN producto ON producto.etiqueta = equipo.etiquetaEquipo
        LEFT JOIN equipo_has_usuario ON equipo.etiquetaEquipo = equipo_has_usuario.etiquetaEquipo
        LEFT JOIN usuario ON usuario.Usuario = equipo_has_usuario.Usuario
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            res.status(500).json({ error: 'Error en la consulta' });
            return;
        }
        results.forEach(result => {
            if (result.fechaCompra) {
                result.fechaCompra = result.fechaCompra.toISOString().split('T')[0];
            }
        });
        res.json(results);
    });
});

module.exports = router;
