const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// GET /accesorios
router.get('/accesorios', async (req, res) => {
  const sqlQuery = `
    USE MTSK;
    SELECT 
      accesorio.etiquetaAccesorio, 
      accesorio.nombreProducto, 
      accesorio.Stock, 
      accesorio.descripcion, 
      accesorio.qr_code_token
    FROM accesorio 
    INNER JOIN producto ON producto.etiqueta = accesorio.etiquetaAccesorio;
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(sqlQuery);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al consultar la base de datos:', err);
    res.status(500).json({ error: 'Error en la consulta' });
  }
});

// POST /accesorios/stock
router.post('/accesorios/stock', async (req, res) => {
  const { etiquetaAccesorio, accion } = req.body;

  if (!etiquetaAccesorio || !['mete', 'saka'].includes(accion)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  const operacion = accion === 'mete' ? '+ 1' : '- 1';

  const sqlQuery = `
    USE MTSK;
    UPDATE accesorio
    SET stock = CASE 
      WHEN stock ${operacion} < 0 THEN 0
      ELSE stock ${operacion}
    END
    WHERE etiquetaAccesorio = @etiquetaAccesorio;
  `;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('etiquetaAccesorio', sql.VarChar, etiquetaAccesorio)
      .query(sqlQuery);

    res.json({ success: true });
  } catch (err) {
    console.error('Error al actualizar stock:', err);
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
});

module.exports = router;
