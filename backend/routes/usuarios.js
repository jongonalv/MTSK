const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET /usuarios
router.get("/", (req, res) => {
  const sqlQuery = 'SELECT Usuario, Nombre FROM usuario';
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error al obtener la lista de usuarios: ', err);
      return res.status(500).send('Error al obtener la lista de usuarios');
    }
    res.json(result);
  });
});

module.exports = router;
