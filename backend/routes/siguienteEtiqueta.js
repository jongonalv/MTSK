const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

router.get('/siguienteEtiqueta', async (req, res) => {
  const { prefijo } = req.query;

  if (!prefijo || typeof prefijo !== 'string') {
    return res.status(400).json({ error: 'Prefijo requerido y debe ser una cadena válida' });
  }

  const query = `
    USE MTSK;
    SELECT etiquetaEquipo 
    FROM dbo.equipo 
    WHERE etiquetaEquipo LIKE @prefijo
  `;

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('prefijo', sql.VarChar, `${prefijo}%`);
    const result = await request.query(query);

    const numeros = result.recordset
      .map(r => {
        const match = r.etiquetaEquipo.match(new RegExp(`^${prefijo}(\\d+)$`));
        return match ? parseInt(match[1], 10) : NaN;
      })
      .filter(n => !isNaN(n));

    const max = numeros.length > 0 ? Math.max(...numeros) : 0;
    const siguiente = (max + 1).toString().padStart(3, '0');

    res.json({ siguienteNumero: siguiente });

  } catch (err) {
    console.error('Error al consultar la base de datos:', err);
    res.status(500).json({ error: 'Error al obtener la siguiente etiqueta' });
  }
});

module.exports = router;
