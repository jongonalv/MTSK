const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET /movimientos
router.get("/", (req, res) => {
  const sqlQuery = `
    SELECT ID_Movimiento, etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario
    FROM movimiento
    ORDER BY fecha DESC
    LIMIT 10
  `;
  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error al obtener movimientos:', err);
      return res.status(500).json({ error: 'Error al obtener movimientos' });
    }
    results.forEach(mov => {
      if (mov.fecha) {
        const d = new Date(mov.fecha);
        mov.fecha = d.toISOString().replace('T', ' ').substring(0, 16);
      }
    });
    res.json(results);
  });
});

module.exports = router;
