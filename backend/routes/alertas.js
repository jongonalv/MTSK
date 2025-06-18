const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// Obtener todas las alertas
router.get('/alertas', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM alerta');
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener alertas:", err);
    res.status(500).json({ error: "Error al obtener las alertas" });
  }
});

// Agregar una alerta
router.post('/alertas', async (req, res) => {
  const { etiquetaProducto, mensaje } = req.body;
  if (!etiquetaProducto || !mensaje) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const pool = await poolPromise;
    const fecha = new Date();

    await pool.request()
      .input('etiquetaProducto', sql.VarChar, etiquetaProducto)
      .input('Fecha', sql.DateTime, fecha)
      .input('Mensaje', sql.VarChar, mensaje)
      .query(`
        INSERT INTO alerta (etiquetaProducto, Fecha, Mensaje)
        VALUES (@etiquetaProducto, @Fecha, @Mensaje)
      `);

    res.json({ success: true });
  } catch (err) {
    console.error("Error al insertar alerta:", err);
    res.status(500).json({ error: "Error al guardar la alerta" });
  }
});

// Eliminar alertas por etiquetaProducto
router.delete('/alertas/:etiquetaProducto', async (req, res) => {
  const { etiquetaProducto } = req.params;
  if (!etiquetaProducto) {
    return res.status(400).json({ error: "Falta etiquetaProducto" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('etiquetaProducto', sql.VarChar, etiquetaProducto)
      .query('DELETE FROM alerta WHERE etiquetaProducto = @etiquetaProducto');

    res.json({ success: true, deleted: result.rowsAffected[0] });
  } catch (err) {
    console.error("Error al borrar alerta:", err);
    res.status(500).json({ error: "Error al borrar la alerta" });
  }
});

module.exports = router;
