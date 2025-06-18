const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db"); // <-- Importa así

router.post('/usuarios', async (req, res) => {
    const { Usuario, Nombre } = req.body;

    if (typeof Usuario !== 'string' || typeof Nombre !== 'string' || !Usuario.trim() || !Nombre.trim()) {
        return res.status(400).json({ error: 'Usuario y Nombre son requeridos y deben ser cadenas no vacías' });
    }

    let transaction;

    try {
        const pool = await poolPromise; // <-- Espera el pool
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        // Insertar usuario
        const request1 = new sql.Request(transaction);
        await request1
            .input('Usuario', sql.VarChar, Usuario)
            .input('Nombre', sql.VarChar, Nombre)
            .query(`
                INSERT INTO dbo.usuario (Usuario, Nombre)
                VALUES (@Usuario, @Nombre);
            `);

        // Insertar movimiento asociado
        const tipoMovimiento = 'Alta usuario';
        const comentario = `Se ha agregado el usuario ${Usuario} (${Nombre}) al inventario`;
        const now = new Date();

        const request2 = new sql.Request(transaction);
        await request2
            .input('etiquetaProducto', sql.VarChar, null)
            .input('usuario', sql.VarChar, Usuario)
            .input('fecha', sql.DateTime, now)
            .input('tipoMovimiento', sql.VarChar, tipoMovimiento)
            .input('comentario', sql.VarChar, comentario)
            .query(`
                INSERT INTO dbo.movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (@etiquetaProducto, @usuario, @fecha, @tipoMovimiento, @comentario);
            `);

        await transaction.commit();
        return res.status(201).json({ message: 'Usuario agregado y movimiento registrado correctamente' });

    } catch (err) {
        console.error('Error al agregar usuario o registrar movimiento:', err);
        if (transaction) await transaction.rollback();
        return res.status(500).json({
            error: 'Error al agregar usuario',
            detalle: err.originalError?.info?.message || err.message
        });
    }
});

module.exports = router;