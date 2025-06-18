const express = require("express");
const router = express.Router();
const db = require("../db");
router.get('/movimientos', async (req, res) => {
    const sqlQuery = `
        USE MTSK;
        SELECT TOP 1000 ID_Movimiento, etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario
        FROM movimiento
        ORDER BY fecha DESC
    `;

    try {
        const pool = await db.poolPromise;
        const result = await pool.request().query(sqlQuery);

        const movimientos = result.recordset.map(mov => {
            if (mov.fecha) {
                const now = new Date(mov.fecha);
                mov.fecha = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            }
            return mov;
        });

        res.json(movimientos);
    } catch (err) {
        console.error('Error al obtener movimientos:', err);
        res.status(500).json({ error: 'Error al obtener movimientos' });
    }
});

module.exports = router;
