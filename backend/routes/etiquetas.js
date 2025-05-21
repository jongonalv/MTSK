const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET /siguienteEtiqueta
router.get("/siguienteEtiqueta", (req, res) => {
  const { prefijo } = req.query;
  if (!prefijo) return res.status(400).json({ error: 'Prefijo requerido' });

  const sql = `
    SELECT etiquetaEquipo 
    FROM equipo 
    WHERE etiquetaEquipo LIKE ? 
    ORDER BY etiquetaEquipo ASC
  `;
  db.query(sql, [`${prefijo}%`], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    const usados = results
      .map(r => parseInt(r.etiquetaEquipo.slice(prefijo.length), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    let siguienteNumero = 1;
    for (let i = 0; i < usados.length; i++) {
      if (usados[i] !== i + 1) {
        siguienteNumero = i + 1;
        break;
      }
      siguienteNumero = usados.length + 1;
    }
    res.json({ siguienteNumero: siguienteNumero.toString().padStart(3, '0') });
  });
});

module.exports = router;
