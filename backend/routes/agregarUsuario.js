const express = require("express");
const router = express.Router();
const db = require("../db");

// Ruta para agregar un usuario
router.post('/usuarios', (req, res) => {
    const { Usuario, Nombre } = req.body;
    
    // Validar que los campos requeridos no estén vacíos
    if (!Usuario || !Nombre) {
        return res.status(400).json({ error: 'Usuario y Nombre son requeridos' });
    }
    const sqlQuery = 'INSERT INTO usuario (Usuario, Nombre) VALUES (?, ?)';

    // Verificar si el usuario ya existe
       db.query(sqlQuery, [Usuario, Nombre], (err, result) => {
        if (err) {
            console.error('Error al agregar usuario: ', err);
            return res.status(500).json({ error: 'Error al agregar usuario' });
        }

        // Variables para registrar el movimiento
        const tipoMovimiento = 'Alta usuario';
        const comentario = `Se ha agregado el usuario ${Usuario} (${Nombre}) al inventario`;
        const now = new Date();
        const fecha = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
        const sqlMovimiento = `
            INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
            VALUES (?, ?, ?, ?, ?)
        `;
        // Registrar el movimiento
        db.query(sqlMovimiento, [null, Usuario, fecha, tipoMovimiento, comentario], (err) => {
            if (err) {
                console.error('Error al registrar movimiento: ', err);
                return res.status(201).json({ 
                    message: 'Usuario agregado, pero error al registrar movimiento' 
                });
            }
            res.status(201).json({ message: 'Usuario agregado y movimiento registrado correctamente' });
        });
    });
});

module.exports = router;
