const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

router.get('/usuarios', async (req, res) => {
  const sqlQuery = `
    USE MTSK;
    SELECT Usuario, Nombre FROM dbo.usuario
  `;

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(sqlQuery); 
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener la lista de usuarios: ', err);
    res.status(500).send('Error al obtener la lista de usuarios');
  }
});

module.exports = router;
