const express = require("express");
const router = express.Router();
const db = require("../db");

// Ruta para agregar un usuario
router.post('/usuarios', (req, res) => {
    const { Usuario, Nombre } = req.body;
    if (!Usuario || !Nombre) {
        return res.status(400).json({ error: 'Usuario y Nombre son requeridos' });
    }
    const sqlQuery = 'INSERT INTO usuario (Usuario, Nombre) VALUES (?, ?)';
    db.query(sqlQuery, [Usuario, Nombre], (err, result) => {
        if (err) {
            console.error('Error al agregar usuario: ', err);
            return res.status(500).json({ error: 'Error al agregar usuario' });
        }
        res.status(201).json({ message: 'Usuario agregado correctamente' });
    });
});

module.exports = router;
