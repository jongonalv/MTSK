const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

router.post('/equipo/:etiquetaEquipo/asignar', async (req, res) => {
    const { etiquetaEquipo } = req.params;
    const { usuario } = req.body;

    let transaction;

    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        // 1. Eliminar asignación anterior
        const reqDelete = new sql.Request(transaction);
        await reqDelete
            .input('etiquetaEquipo', sql.VarChar, etiquetaEquipo)
            .query(`USE MTSK; DELETE FROM equipo_has_usuario WHERE etiquetaEquipo = @etiquetaEquipo`);

        // 2. Insertar nueva asignación
        const reqInsert = new sql.Request(transaction);
        await reqInsert
            .input('etiquetaEquipo', sql.VarChar, etiquetaEquipo)
            .input('Usuario', sql.VarChar, usuario.Usuario)
            .query(`USE MTSK; INSERT INTO equipo_has_usuario (etiquetaEquipo, Usuario) VALUES (@etiquetaEquipo, @Usuario)`);

        // 3. Obtener el nombre del usuario
        const reqNombre = new sql.Request(transaction);
        const nombreResult = await reqNombre
            .input('Usuario', sql.VarChar, usuario.Usuario)
            .query(`USE MTSK; SELECT Nombre FROM usuario WHERE Usuario = @Usuario`);

        const nombreUsuario = nombreResult.recordset.length > 0 ? nombreResult.recordset[0].Nombre : usuario.Usuario;

        // 4. Insertar movimiento
        const tipoMovimiento = 'Asignar usuario';
        const comentario = `Se ha asignado el equipo ${etiquetaEquipo} a ${nombreUsuario}`;
        const now = new Date();

        const reqMovimiento = new sql.Request(transaction);
        await reqMovimiento
            .input('etiquetaProducto', sql.VarChar, etiquetaEquipo)
            .input('usuario', sql.VarChar, usuario.Usuario)
            .input('fecha', sql.DateTime, now)
            .input('tipoMovimiento', sql.VarChar, tipoMovimiento)
            .input('comentario', sql.VarChar, comentario)
            .query(`
                USE MTSK;
                INSERT INTO movimiento (etiquetaProducto, usuario, fecha, tipoMovimiento, Comentario)
                VALUES (@etiquetaProducto, @usuario, @fecha, @tipoMovimiento, @comentario)
            `);

        await transaction.commit();
        res.json({ success: true, message: 'Usuario asignado correctamente' });

    } catch (err) {
        console.error("Error en la transacción de asignación:", err);
        if (transaction) await transaction.rollback();
        res.status(500).json({ error: 'Error durante la asignación de usuario' });
    }
});

module.exports = router;
