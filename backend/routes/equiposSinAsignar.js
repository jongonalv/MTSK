const express = require('express');
const router = express.Router();
const db = require('../db');

// Devuelve todas las etiquetas de equipos que ya están asignados
router.get('/equipos-sin-asignar', (req, res) => {
  db.query(
    `SELECT DISTINCT etiquetaEquipo FROM equipo_has_usuario WHERE etiquetaEquipo IS NOT NULL`,
    (error, results) => {
      if (error) {
        console.error('Error al obtener etiquetas de equipos asignados:', error);
        return res.status(500).json({ error: 'Error al obtener etiquetas de equipos asignados' });
      }
      res.json(results);
    }
  );
});

module.exports = router;