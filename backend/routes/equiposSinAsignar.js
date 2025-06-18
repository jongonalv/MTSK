const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // conexión con SQL Server

// Devuelve todas las etiquetas de equipos que ya están asignados
router.get('/equipos-sin-asignar', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT DISTINCT etiquetaEquipo 
      FROM equipo_has_usuario 
      WHERE etiquetaEquipo IS NOT NULL
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener etiquetas de equipos asignados:', error);
    res.status(500).json({ error: 'Error al obtener etiquetas de equipos asignados' });
  }
});

module.exports = router;
