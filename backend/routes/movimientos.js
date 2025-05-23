const express = require("express");
const router = express.Router();
const db = require("../db");

router.get('/movimientos', (req, res) => {
    const sqlQuery = `
        SELECT ID_Movimiento, etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario
        FROM movimiento
        ORDER BY fecha DESC
        LIMIT 1000
    `;
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener movimientos:', err);
            res.status(500).json({ error: 'Error al obtener movimientos' });
            return;
        }
        results.forEach(mov => {
            if (mov.fecha) {
                const now = new Date(mov.fecha);
                mov.fecha = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
            }
        });
        res.json(results);
    });
});

module.exports = router;
