const express = require("express");
const router = express.Router();
const db = require("../db");

// Ruta para conseguir todas las alertas del backend
router.get('/alertas', (req, res) => {
  db.query('SELECT * FROM alerta', (err, results) => {
    if (err) {
      console.error("Error al obtener alertas:", err);
      return res.status(500).json({ error: "Error al obtener las alertas" });
    }
    res.json(results);
  });
});

// Ruta para agregar una alerta
router.post('/alertas', (req, res) => {
  const { etiquetaProducto, mensaje } = req.body;
  if (!etiquetaProducto || !mensaje) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  const fecha = new Date();
  const sql = `
    INSERT INTO alerta (etiquetaProducto, Fecha, Mensaje)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [etiquetaProducto, fecha, mensaje], (err, result) => {
    if (err) {
      console.error("Error al insertar alerta:", err);
      return res.status(500).json({ error: "Error al guardar la alerta" });
    }
    res.json({ success: true, id: result.insertId });
  });
});

router.delete('/alertas/:etiquetaProducto', (req, res) => {
  const { etiquetaProducto } = req.params;
  if (!etiquetaProducto) {
    return res.status(400).json({ error: "Falta etiquetaProducto" });
  }
  db.query(
    'DELETE FROM alerta WHERE etiquetaProducto = ?',
    [etiquetaProducto],
    (err, result) => {
      if (err) {
        console.error("Error al borrar alerta:", err);
        return res.status(500).json({ error: "Error al borrar la alerta" });
      }
      res.json({ success: true, deleted: result.affectedRows });
    }
  );
});

module.exports = router;